
import { v4 as uuidv4 } from 'uuid';
import { Sticker } from '@/types/stickers';
import { WidgetAPI, registerWidget } from '@/lib/widgetAPI';
import JSZip from 'jszip';

/**
 * Creates a new widget with the given options and returns a sticker.
 * This is a simplified way to create widgets for novice users.
 */
export const createSimpleWidget = (options: {
  name: string;
  title: string;
  description: string;
  icon: string;
  backgroundColor?: string;
  initialState?: Record<string, any>;
  actions?: Record<string, (state: any, payload?: any) => any>;
}) => {
  const {
    name,
    title,
    description,
    icon,
    backgroundColor = '#4CAF50',
    initialState = {},
    actions = {}
  } = options;
  
  // Create a simple widget implementation
  let state = { ...initialState };
  
  const widget: WidgetAPI = {
    init() {
      console.log(`${name} widget initialized`);
    },
    
    getState() {
      return state;
    },
    
    setState(newState) {
      state = { ...state, ...newState };
    },
    
    trigger(action, payload) {
      // Check if this action is defined in the actions map
      if (actions[action]) {
        state = actions[action](state, payload);
        return true;
      } else {
        console.warn(`Action '${action}' not defined for widget '${name}'`);
        return false;
      }
    }
  };
  
  // Register the widget
  registerWidget(name, widget);
  
  // Create and return the sticker
  const sticker: Sticker = {
    id: uuidv4(),
    name,
    icon,
    position: { x: 0, y: 0 },
    placed: false,
    size: 60,
    rotation: 0,
    widgetType: name
  };
  
  // Add the widget to the dashboard's widget data map
  import('@/utils/widgetHelpers').then(({ addWidget }) => {
    addWidget(name, title, description);
  });
  
  return sticker;
};

/**
 * Creates a simple icon for a widget using an emoji or text.
 */
export const createSimpleIcon = (
  content: string,
  backgroundColor: string = '#4CAF50',
  textColor: string = 'white'
) => {
  // Create a canvas to generate the icon
  const canvas = document.createElement('canvas');
  canvas.width = 60;
  canvas.height = 60;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.arc(30, 30, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw text/emoji
    ctx.fillStyle = textColor;
    ctx.font = content.length === 1 || content.match(/\p{Emoji}/u) ? '32px Arial' : '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(content, 30, 30);
  }
  
  return canvas.toDataURL('image/png');
};

/**
 * Opens the IndexedDB database for widget storage
 */
const openWidgetDatabase = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('WidgetStorage', 1);
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('widgets')) {
        db.createObjectStore('widgets', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('widgetFiles')) {
        db.createObjectStore('widgetFiles', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Stores widget data in IndexedDB
 */
const storeWidgetData = async (
  id: string, 
  manifest: any, 
  files: Record<string, string | Blob>
) => {
  const db = await openWidgetDatabase();
  
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(['widgets', 'widgetFiles'], 'readwrite');
    
    // Store manifest and metadata
    const widgetStore = transaction.objectStore('widgets');
    const metadata = {
      id,
      manifest,
      installedAt: new Date().toISOString(),
      state: {
        count: 0,
        active: true
      }
    };
    
    const metadataRequest = widgetStore.put(metadata);
    
    // Store files
    const filesStore = transaction.objectStore('widgetFiles');
    const filesData = {
      id,
      files
    };
    
    const filesRequest = filesStore.put(filesData);
    
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

/**
 * Processes a widget package ZIP file and creates a proper widget
 */
export const processWidgetPackage = async (
  zipFile: File, 
  widgetName: string,
  customIconFile?: File | null
): Promise<Sticker | null> => {
  try {
    console.log(`Processing widget package: ${zipFile.name}`);
    
    // Create a unique widget ID from the name
    const widgetId = widgetName.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    
    // Load and process the ZIP file
    const zip = await JSZip.loadAsync(zipFile);
    
    // Validate ZIP structure - look for manifest.json
    const manifestFile = zip.file('manifest.json');
    if (!manifestFile) {
      console.error('Invalid widget package: No manifest.json found');
      return null;
    }
    
    // Read the manifest
    const manifestContent = await manifestFile.async('string');
    let manifest;
    
    try {
      manifest = JSON.parse(manifestContent);
    } catch (e) {
      console.error('Invalid widget package: Manifest is not valid JSON', e);
      return null;
    }
    
    // Check for entry point (index.html)
    const entryFile = manifest.entry ? zip.file(manifest.entry) : zip.file('index.html');
    if (!entryFile) {
      console.error('Invalid widget package: No entry point (index.html) found');
      return null;
    }
    
    // Extract all files we need
    const files: Record<string, string | Blob> = {};
    
    // Get HTML content
    files['index.html'] = await entryFile.async('string');
    
    // Process the icon - either from custom upload, package, or create a placeholder
    let widgetIcon;
    
    if (customIconFile) {
      // Use the custom uploaded icon
      const iconBlob = customIconFile;
      files['custom-icon'] = iconBlob;
      widgetIcon = URL.createObjectURL(iconBlob);
    } else {
      // Look for icon in the package
      const iconFile = manifest.icon ? zip.file(manifest.icon) : zip.file('icon.png') || zip.file('icon.svg');
      if (iconFile) {
        const iconBlob = await iconFile.async('blob');
        files[manifest.icon || 'icon'] = iconBlob;
        widgetIcon = URL.createObjectURL(iconBlob);
      } else {
        // Create a placeholder icon
        widgetIcon = createSimpleIcon('📋', '#6200EA');
      }
    }
    
    // Store the data in IndexedDB
    await storeWidgetData(widgetId, manifest, files);
    
    // Define common actions that most widgets use
    const actions = {
      increment: (state: any) => {
        console.log("Increment action triggered");
        return { 
          ...state, 
          count: (state.count || 0) + 1 
        };
      },
      decrement: (state: any) => {
        console.log("Decrement action triggered");
        return { 
          ...state, 
          count: Math.max(0, (state.count || 0) - 1) 
        };
      },
      reset: (state: any) => {
        console.log("Reset action triggered");
        return { 
          ...state, 
          count: 0, 
          lastReset: new Date().toISOString() 
        };
      },
      toggle: (state: any) => {
        console.log("Toggle action triggered");
        return { 
          ...state, 
          active: !state.active 
        };
      }
    };
    
    // Create a widget sticker
    const sticker = createSimpleWidget({
      name: widgetId,
      title: manifest.name || `${widgetName}`,
      description: manifest.description || `This widget was loaded from the ${zipFile.name} package.`,
      icon: widgetIcon,
      initialState: { 
        count: 0, 
        active: true,
        packageName: zipFile.name,
        installedAt: new Date().toISOString()
      },
      actions
    });
    
    // Add packageUrl to sticker for proper rendering
    sticker.packageUrl = URL.createObjectURL(zipFile);

    console.log(`Created widget sticker with widgetType: ${sticker.widgetType}`);
    
    return sticker;
  } catch (error) {
    console.error("Error processing widget package:", error);
    return null;
  }
};

/**
 * Gets the content of a widget's HTML file from storage
 */
export const getWidgetHtml = async (widgetId: string): Promise<string | null> => {
  try {
    const db = await openWidgetDatabase();
    
    return new Promise<string | null>((resolve, reject) => {
      const transaction = db.transaction(['widgetFiles'], 'readonly');
      const store = transaction.objectStore('widgetFiles');
      
      const request = store.get(widgetId);
      
      request.onsuccess = () => {
        if (request.result && request.result.files && request.result.files['index.html']) {
          let html = request.result.files['index.html'] as string;
          
          // Inject the handshake script right before </body>
          const handshakeScript = `
<script>
// Widget handshake script
(function() {
  console.log('[Widget] Initializing widget and handshake');
  let internalState = {};
  let hasSignaledReady = false;
  
  function updateUI(state) {
    console.log('[Widget] Updating UI with state:', state);
    internalState = state || {};
    
    // Try to find a display element to show the state
    const stateDisplay = document.getElementById('widget-state-display');
    if(stateDisplay) {
      stateDisplay.textContent = JSON.stringify(state, null, 2);
    }
    
    // You can add more UI update logic here
  }
  
  function handleIncrement() {
    console.log('[Widget] Increment action called');
    const newState = { ...internalState, count: (internalState.count || 0) + 1 };
    window.parent.postMessage({ type: 'UPDATE_STATE', payload: newState }, '*');
  }
  
  function handleDecrement() {
    console.log('[Widget] Decrement action called');
    const newState = { ...internalState, count: Math.max(0, (internalState.count || 0) - 1) };
    window.parent.postMessage({ type: 'UPDATE_STATE', payload: newState }, '*');
  }
  
  function handleReset() {
    console.log('[Widget] Reset action called');
    const newState = { ...internalState, count: 0 };
    window.parent.postMessage({ type: 'UPDATE_STATE', payload: newState }, '*');
  }
  
  function handleToggle() {
    console.log('[Widget] Toggle action called');
    const newState = { ...internalState, active: !(internalState.active || false) };
    window.parent.postMessage({ type: 'UPDATE_STATE', payload: newState }, '*');
  }
  
  function signalReady() {
    if (!hasSignaledReady) {
      console.log('[Widget] Sending WIDGET_READY signal to parent');
      window.parent.postMessage({ type: 'WIDGET_READY' }, '*');
      hasSignaledReady = true;
    }
  }
  
  // Listen for messages from parent
  window.addEventListener('message', function(event) {
    console.log('[Widget] Received message from parent:', event.data);
    const { type, payload } = event.data;
    
    if (type === 'INIT_STATE' || type === 'CURRENT_STATE') {
      updateUI(payload);
    }
  });
  
  // Connect any action buttons that might exist in the widget
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[Widget] DOM loaded, connecting action buttons if they exist');
    
    // Try to find and connect action buttons
    const incButton = document.getElementById('increment-button');
    if (incButton) incButton.addEventListener('click', handleIncrement);
    
    const decButton = document.getElementById('decrement-button');
    if (decButton) decButton.addEventListener('click', handleDecrement);
    
    const resetButton = document.getElementById('reset-button');
    if (resetButton) resetButton.addEventListener('click', handleReset);
    
    const toggleButton = document.getElementById('toggle-button');
    if (toggleButton) toggleButton.addEventListener('click', handleToggle);
    
    // Signal we're ready to receive state
    signalReady();
  });
})();
</script>
`;
          
          if (html.includes('</body>')) {
            // Insert the script right before </body>
            html = html.replace('</body>', handshakeScript + '\n</body>');
          } else {
            // If no </body> tag, append to the end
            html += handshakeScript;
          }
          
          console.log(`[Parent] Widget HTML enhanced with handshake script for ${widgetId}`);
          resolve(html);
        } else {
          console.error(`[Parent] No HTML file found for widget ${widgetId}`);
          resolve(null);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[Parent] Error getting widget HTML:', error);
    return null;
  }
};

/**
 * Gets the widget state from storage
 */
export const getWidgetState = async (widgetId: string): Promise<any> => {
  try {
    const db = await openWidgetDatabase();
    
    return new Promise<any>((resolve, reject) => {
      const transaction = db.transaction(['widgets'], 'readonly');
      const store = transaction.objectStore('widgets');
      
      const request = store.get(widgetId);
      
      request.onsuccess = () => {
        if (request.result && request.result.state) {
          resolve(request.result.state);
        } else {
          resolve({ count: 0, active: true });
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting widget state:', error);
    return { count: 0, active: true };
  }
};

/**
 * Updates the widget state in storage
 */
export const updateWidgetState = async (widgetId: string, newState: any): Promise<void> => {
  try {
    const db = await openWidgetDatabase();
    
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(['widgets'], 'readwrite');
      const store = transaction.objectStore('widgets');
      
      // First get the current data
      const getRequest = store.get(widgetId);
      
      getRequest.onsuccess = () => {
        if (!getRequest.result) {
          reject(new Error('Widget not found'));
          return;
        }
        
        // Update the state
        const data = getRequest.result;
        data.state = newState;
        
        // Put it back
        const putRequest = store.put(data);
        
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch (error) {
    console.error('Error updating widget state:', error);
  }
};
