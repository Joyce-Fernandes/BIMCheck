/**
 * Jest Test Setup - BIMCheck
 * Global configurations for test execution
 */

// Mock console to avoid logs during tests
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
};

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock File API
global.File = class File {
    constructor(bits, name, options = {}) {
        this.name = name;
        this.size = bits.length;
        this.type = options.type || '';
        this.lastModified = options.lastModified || Date.now();
    }
};

global.FileReader = class FileReader {
    constructor() {
        this.readyState = 0;
        this.result = null;
        this.error = null;
        this.onload = null;
        this.onerror = null;
        this.onprogress = null;
    }

    readAsText(file) {
        setTimeout(() => {
            this.readyState = 2;
            this.result = 'Mock IFC content';
            if (this.onload) this.onload();
        }, 100);
    }

    readAsArrayBuffer(file) {
        setTimeout(() => {
            this.readyState = 2;
            this.result = new ArrayBuffer(1024);
            if (this.onload) this.onload();
        }, 100);
    }
};

// Mock Blob
global.Blob = class Blob {
    constructor(content, options = {}) {
        this.size = content.length;
        this.type = options.type || '';
    }
};

// Mock URL.createObjectURL
global.URL = {
    ...global.URL,
    createObjectURL: jest.fn(() => 'mock-url'),
    revokeObjectURL: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn();

// Mock IfcAPI
global.IfcAPI = class IfcAPI {
    constructor() {
        this.initialized = false;
    }

    async Init() {
        this.initialized = true;
        return Promise.resolve();
    }

    async OpenModel(data) {
        return {
            modelID: 1,
            schema: 'IFC4',
            ifcApi: this,
        };
    }

    async CloseModel(modelID) {
        return Promise.resolve();
    }

    async GetAllLinesOfModel(modelID) {
        return [1, 2, 3, 4, 5];
    }

    async GetLine(modelID, lineID) {
        return {
            type: 1,
            arguments: [
                { type: 1, value: `Element_${lineID}` },
                { type: 1, value: 'Test Element' },
                { type: 1, value: 'Test Description' },
            ],
        };
    }

    async GetPropertySets(modelID, elementID) {
        return [
            {
                Name: { value: 'Test Property Set' },
                HasProperties: [
                    {
                        Name: { value: 'Material' },
                        NominalValue: { value: 'Concrete' },
                    },
                    {
                        Name: { value: 'Dimensions' },
                        NominalValue: { value: '100x100x100' },
                    },
                ],
            },
        ];
    }
};

// Mock Three.js
global.THREE = {
    Scene: class Scene {
        constructor() {
            this.children = [];
        }
        add() {}
        remove() {}
    },
    PerspectiveCamera: class PerspectiveCamera {
        constructor() {
            this.position = { x: 0, y: 0, z: 0 };
        }
    },
    WebGLRenderer: class WebGLRenderer {
        constructor() {
            this.domElement = document.createElement('canvas');
        }
        setSize() {}
        render() {}
    },
    BoxGeometry: class BoxGeometry {
        constructor() {}
    },
    MeshBasicMaterial: class MeshBasicMaterial {
        constructor() {}
    },
    Mesh: class Mesh {
        constructor() {}
    },
    AmbientLight: class AmbientLight {
        constructor() {}
    },
    DirectionalLight: class DirectionalLight {
        constructor() {}
    },
};

// Mock IFCLoader
global.IFCLoader = class IFCLoader {
    constructor() {
        this.ifcApi = new global.IfcAPI();
    }

    async load(url) {
        await this.ifcApi.Init();
        return await this.ifcApi.OpenModel(new ArrayBuffer(1024));
    }
};

// Test timeout configuration
jest.setTimeout(30000);

// Environment configuration
process.env.NODE_ENV = 'test';

// Utility function to clear mocks
global.clearMocks = () => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
    sessionStorageMock.getItem.mockClear();
    sessionStorageMock.setItem.mockClear();
    sessionStorageMock.removeItem.mockClear();
    sessionStorageMock.clear.mockClear();
    global.fetch.mockClear();
    global.URL.createObjectURL.mockClear();
    global.URL.revokeObjectURL.mockClear();
};

// Utility function to simulate IFC file
global.createMockIFCFile = (name = 'test.ifc', size = 1024) => {
    const content = `ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('IFC Test File'),'2;1');
FILE_NAME('${name}','2024-01-01T00:00:00',('Test User'),('Test Organization'),'','','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1=IFCPROJECT('1',$,$,$,(#2),#3);
#2=IFCOWNERHISTORY(#4,$,.ADDED.,$,$,$,0);
#3=IFCREPRESENTATIONCONTEXT($,'Model');
#4=IFCPERSONANDORGANIZATION(#5,#6,$);
#5=IFCPERSON($,'Test','User',$,$,$,$,$);
#6=IFCORGANIZATION($,'Test Organization',$,$,$);
ENDSEC;
END-ISO-10303-21;`;
    
    return new global.File([content], name, {
        type: 'application/ifc',
        lastModified: Date.now(),
    });
};

// Utility function to simulate file upload event
global.simulateFileUpload = (file) => {
    const event = {
        target: {
            files: [file],
        },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
    };
    return event;
};

// Utility function to simulate drag and drop
global.simulateDragAndDrop = (files) => {
    const event = {
        dataTransfer: {
            files: files,
        },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
    };
    return event;
};

// Custom matchers configuration
expect.extend({
    toBeValidIFCFile(received) {
        const pass = received instanceof File && 
                    received.name.endsWith('.ifc') && 
                    received.size > 0;
        
        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid IFC file`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be a valid IFC file`,
                pass: false,
            };
        }
    },
    
    toHaveValidationResults(received) {
        const pass = received && 
                    typeof received === 'object' &&
                    'totalElements' in received &&
                    'issues' in received &&
                    Array.isArray(received.issues);
        
        if (pass) {
            return {
                message: () => `expected ${received} not to have validation results`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to have validation results`,
                pass: false,
            };
        }
    },
});

// DOM environment configuration
if (typeof document === 'undefined') {
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
        url: 'http://localhost',
    });
    
    global.document = dom.window.document;
    global.window = dom.window;
    global.navigator = dom.window.navigator;
    global.HTMLElement = dom.window.HTMLElement;
    global.Element = dom.window.Element;
    global.Node = dom.window.Node;
    global.Event = dom.window.Event;
    global.CustomEvent = dom.window.CustomEvent;
    global.MouseEvent = dom.window.MouseEvent;
    global.KeyboardEvent = dom.window.KeyboardEvent;
    global.DragEvent = dom.window.DragEvent;
}

console.log('✅ Test setup configured successfully'); 