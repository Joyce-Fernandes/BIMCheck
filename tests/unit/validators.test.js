/**
 * IFC File Validators - Unit Test Suite
 * Comprehensive unit testing for IFC file validation functions
 */

// Mock validation functions (for demonstration)
// In a real project, these functions would come from the main file
const validateFileExtension = (file) => {
    if (!file || !file.name) return false;
    return file.name.toLowerCase().endsWith('.ifc');
};

const validateFileSize = (file, maxSize = 100 * 1024 * 1024) => {
    if (!file || !file.size) return false;
    return file.size <= maxSize;
};

const validateIFCContent = async (file) => {
    if (!file) return false;
    // Simulates IFC content validation
    return file.name.toLowerCase().includes('ifc') || file.type === 'application/ifc';
};

const validateMaterial = (element) => {
    if (!element || !element.properties) return false;
    const material = element.properties.material;
    if (!material || !material.value) return false;
    return material.value.trim() !== '';
};

const validateDimensions = (element) => {
    if (!element || !element.properties) return false;
    const dimensions = element.properties.dimensions;
    if (!dimensions || !dimensions.value) return false;
    
    // Validates dimensions are valid (not zero or negative)
    const dims = dimensions.value.split('x').map(d => parseFloat(d));
    return dims.every(d => d > 0);
};

const validateNormCode = (element) => {
    if (!element || !element.properties) return false;
    const normCode = element.properties.normCode;
    if (!normCode || !normCode.value) return false;
    
    // Validates norm code follows known patterns
    const code = normCode.value.toUpperCase();
            return code.includes('EN') || code.includes('ISO') || code.includes('ASTM');
};

const generateValidationReport = (results) => {
    return {
        totalElements: results.elements.length,
        issues: results.issues,
        status: results.issues.length === 0 ? 'success' : 'warning',
        timestamp: new Date().toISOString()
    };
};

// Helper functions for testing
const createMockIFCFile = (name, size = 1024) => {
    const isIFC = name.toLowerCase().endsWith('.ifc');
    return {
        name: name,
        size: size,
        type: isIFC ? 'application/ifc' : 'text/plain'
    };
};

const clearMocks = () => {
    // Clear mocks if necessary
};

// Custom matcher for validation results
expect.extend({
    toHaveValidationResults(received) {
        const pass = received && 
                    typeof received.totalElements === 'number' &&
                    Array.isArray(received.issues) &&
                    typeof received.status === 'string' &&
                    typeof received.timestamp === 'string';
        
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

describe('IFC File Extension Validation', () => {
    beforeEach(() => {
        clearMocks();
    });

    describe('validateFileExtension', () => {
        test('should accept file with .ifc extension', () => {
            const validFile = createMockIFCFile('test.ifc');
            expect(validateFileExtension(validFile)).toBe(true);
        });

        test('should accept file with .IFC extension (uppercase)', () => {
            const validFile = createMockIFCFile('test.IFC');
            expect(validateFileExtension(validFile)).toBe(true);
        });

        test('should reject file with invalid extension', () => {
            const invalidFile = createMockIFCFile('test.txt');
            expect(validateFileExtension(invalidFile)).toBe(false);
        });

        test('should reject file without extension', () => {
            const invalidFile = createMockIFCFile('test');
            expect(validateFileExtension(invalidFile)).toBe(false);
        });

        test('should reject null file', () => {
            expect(validateFileExtension(null)).toBe(false);
        });

        test('should reject file without name', () => {
            const invalidFile = { size: 1024 };
            expect(validateFileExtension(invalidFile)).toBe(false);
        });
    });

    describe('validateFileSize', () => {
        test('should accept file within size limit', () => {
            const validFile = { size: 50 * 1024 * 1024 }; // 50MB
            expect(validateFileSize(validFile)).toBe(true);
        });

        test('should accept file exactly at limit', () => {
            const validFile = { size: 100 * 1024 * 1024 }; // 100MB
            expect(validateFileSize(validFile)).toBe(true);
        });

        test('should reject file exceeding size limit', () => {
            const invalidFile = { size: 150 * 1024 * 1024 }; // 150MB
            expect(validateFileSize(invalidFile)).toBe(false);
        });

        test('should accept small file', () => {
            const validFile = { size: 1024 }; // 1KB
            expect(validateFileSize(validFile)).toBe(true);
        });

        test('should reject file without size', () => {
            const invalidFile = { name: 'test.ifc' };
            expect(validateFileSize(invalidFile)).toBe(false);
        });

        test('should reject null file', () => {
            expect(validateFileSize(null)).toBe(false);
        });
    });

    describe('validateIFCContent', () => {
        test('should accept file with valid IFC content', async () => {
            const validFile = createMockIFCFile('test.ifc');
            const result = await validateIFCContent(validFile);
            expect(result).toBe(true);
        });

        test('should accept file with correct MIME type', async () => {
            const validFile = new File(['content'], 'test.ifc', { type: 'application/ifc' });
            const result = await validateIFCContent(validFile);
            expect(result).toBe(true);
        });

        test('should reject file without IFC content', async () => {
            const invalidFile = createMockIFCFile('test.txt');
            const result = await validateIFCContent(invalidFile);
            expect(result).toBe(false);
        });

        test('should reject null file', async () => {
            const result = await validateIFCContent(null);
            expect(result).toBe(false);
        });
    });
});

describe('BIM Element Property Validation', () => {
    describe('validateMaterial', () => {
        test('should accept element with defined material', () => {
            const validElement = {
                properties: {
                    material: { value: 'Concrete' }
                }
            };
            expect(validateMaterial(validElement)).toBe(true);
        });

        test('should reject element without material', () => {
            const invalidElement = {
                properties: {}
            };
            expect(validateMaterial(invalidElement)).toBe(false);
        });

        test('should reject element with empty material', () => {
            const invalidElement = {
                properties: {
                    material: { value: '' }
                }
            };
            expect(validateMaterial(invalidElement)).toBe(false);
        });

        test('should reject null element', () => {
            expect(validateMaterial(null)).toBe(false);
        });

        test('should reject element without properties', () => {
            const invalidElement = {};
            expect(validateMaterial(invalidElement)).toBe(false);
        });
    });

    describe('validateDimensions', () => {
        test('should accept element with valid dimensions', () => {
            const validElement = {
                properties: {
                    dimensions: { value: '100x200x300' }
                }
            };
            expect(validateDimensions(validElement)).toBe(true);
        });

        test('should accept dimensions with decimals', () => {
            const validElement = {
                properties: {
                    dimensions: { value: '100.5x200.75x300.25' }
                }
            };
            expect(validateDimensions(validElement)).toBe(true);
        });

        test('should reject element with zero dimension', () => {
            const invalidElement = {
                properties: {
                    dimensions: { value: '0x200x300' }
                }
            };
            expect(validateDimensions(invalidElement)).toBe(false);
        });

        test('should reject element with negative dimension', () => {
            const invalidElement = {
                properties: {
                    dimensions: { value: '-100x200x300' }
                }
            };
            expect(validateDimensions(invalidElement)).toBe(false);
        });

        test('should reject element without dimensions', () => {
            const invalidElement = {
                properties: {}
            };
            expect(validateDimensions(invalidElement)).toBe(false);
        });

        test('should reject element with empty dimensions', () => {
            const invalidElement = {
                properties: {
                    dimensions: { value: '' }
                }
            };
            expect(validateDimensions(invalidElement)).toBe(false);
        });

        test('should reject element with invalid dimension format', () => {
            const invalidElement = {
                properties: {
                    dimensions: { value: 'invalid' }
                }
            };
            expect(validateDimensions(invalidElement)).toBe(false);
        });
    });

    describe('validateNormCode', () => {
        test('should accept European norm code', () => {
            const validElement = {
                properties: {
                    normCode: { value: 'EN 1992-1-1' }
                }
            };
            expect(validateNormCode(validElement)).toBe(true);
        });

        test('should accept ISO norm code', () => {
            const validElement = {
                properties: {
                    normCode: { value: 'ISO 16739:2013' }
                }
            };
            expect(validateNormCode(validElement)).toBe(true);
        });

        test('should accept ASTM norm code', () => {
            const validElement = {
                properties: {
                    normCode: { value: 'ASTM E1557' }
                }
            };
            expect(validateNormCode(validElement)).toBe(true);
        });

        test('should accept lowercase code', () => {
            const validElement = {
                properties: {
                    normCode: { value: 'en 1992-1-1' }
                }
            };
            expect(validateNormCode(validElement)).toBe(true);
        });

        test('should reject element without norm code', () => {
            const invalidElement = {
                properties: {}
            };
            expect(validateNormCode(invalidElement)).toBe(false);
        });

        test('should reject element with empty code', () => {
            const invalidElement = {
                properties: {
                    normCode: { value: '' }
                }
            };
            expect(validateNormCode(invalidElement)).toBe(false);
        });

        test('should reject invalid norm code', () => {
            const invalidElement = {
                properties: {
                    normCode: { value: 'INVALID_CODE' }
                }
            };
            expect(validateNormCode(invalidElement)).toBe(false);
        });
    });
});

describe('Validation Report Generation', () => {
    describe('generateValidationReport', () => {
        test('should generate report with valid elements', () => {
            const results = {
                elements: [
                    { id: 1, name: 'Element 1' },
                    { id: 2, name: 'Element 2' }
                ],
                issues: []
            };

            const report = generateValidationReport(results);

            expect(report).toHaveValidationResults();
            expect(report.totalElements).toBe(2);
            expect(report.issues).toHaveLength(0);
            expect(report.status).toBe('success');
            expect(report.timestamp).toBeDefined();
        });

        test('should generate report with identified issues', () => {
            const results = {
                elements: [
                    { id: 1, name: 'Element 1' },
                    { id: 2, name: 'Element 2' }
                ],
                issues: [
                    { id: 'issue1', elementId: 1, type: 'material', severity: 'high' },
                    { id: 'issue2', elementId: 2, type: 'dimensions', severity: 'medium' }
                ]
            };

            const report = generateValidationReport(results);

            expect(report).toHaveValidationResults();
            expect(report.totalElements).toBe(2);
            expect(report.issues).toHaveLength(2);
            expect(report.status).toBe('warning');
            expect(report.timestamp).toBeDefined();
        });

        test('should generate report with current timestamp', () => {
            const results = {
                elements: [],
                issues: []
            };

            const before = new Date();
            const report = generateValidationReport(results);
            const after = new Date();

            const reportTime = new Date(report.timestamp);
            expect(reportTime.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(reportTime.getTime()).toBeLessThanOrEqual(after.getTime());
        });

        test('should handle empty results', () => {
            const results = {
                elements: [],
                issues: []
            };

            const report = generateValidationReport(results);

            expect(report.totalElements).toBe(0);
            expect(report.issues).toHaveLength(0);
            expect(report.status).toBe('success');
        });
    });
});

describe('Validator Integration Testing', () => {
    test('should validate complete IFC file successfully', async () => {
        const validFile = createMockIFCFile('test.ifc', 1024 * 1024); // 1MB

        // File validations
        expect(validateFileExtension(validFile)).toBe(true);
        expect(validateFileSize(validFile)).toBe(true);
        
        const contentValid = await validateIFCContent(validFile);
        expect(contentValid).toBe(true);

        // Simulate file elements
        const elements = [
            {
                id: 1,
                properties: {
                    material: { value: 'Concrete' },
                    dimensions: { value: '100x200x300' },
                    normCode: { value: 'EN 1992-1-1' }
                }
            },
            {
                id: 2,
                properties: {
                    material: { value: 'Steel' },
                    dimensions: { value: '50x50x50' },
                    normCode: { value: 'ISO 16739:2013' }
                }
            }
        ];

        // Element validations
        elements.forEach(element => {
            expect(validateMaterial(element)).toBe(true);
            expect(validateDimensions(element)).toBe(true);
            expect(validateNormCode(element)).toBe(true);
        });

        // Generate report
        const results = {
            elements: elements,
            issues: []
        };

        const report = generateValidationReport(results);
        expect(report.status).toBe('success');
        expect(report.totalElements).toBe(2);
    });

    test('should detect issues in IFC file validation', async () => {
        const validFile = createMockIFCFile('test.ifc', 1024 * 1024);

        // File validations pass
        expect(validateFileExtension(validFile)).toBe(true);
        expect(validateFileSize(validFile)).toBe(true);
        
        const contentValid = await validateIFCContent(validFile);
        expect(contentValid).toBe(true);

        // Simulate elements with issues
        const elements = [
            {
                id: 1,
                properties: {
                    material: { value: '' }, // Missing material
                    dimensions: { value: '100x200x300' },
                    normCode: { value: 'EN 1992-1-1' }
                }
            },
            {
                id: 2,
                properties: {
                    material: { value: 'Steel' },
                    dimensions: { value: '0x50x50' }, // Zero dimension
                    normCode: { value: 'EN 1992-1-1' }
                }
            },
            {
                id: 3,
                properties: {
                    material: { value: 'Concrete' },
                    dimensions: { value: '100x200x300' },
                    normCode: { value: '' } // Missing norm code
                }
            }
        ];

        // Detect issues
        const issues = [];
        
        elements.forEach((element, index) => {
            if (!validateMaterial(element)) {
                issues.push({
                    id: `issue_${index + 1}`,
                    elementId: element.id,
                    type: 'material',
                    severity: 'high',
                    description: 'Material not defined'
                });
            }
            
            if (!validateDimensions(element)) {
                issues.push({
                    id: `issue_${index + 2}`,
                    elementId: element.id,
                    type: 'dimensions',
                    severity: 'medium',
                    description: 'Invalid dimensions'
                });
            }
            
            if (!validateNormCode(element)) {
                issues.push({
                    id: `issue_${index + 3}`,
                    elementId: element.id,
                    type: 'normCode',
                    severity: 'high',
                    description: 'Missing norm code'
                });
            }
        });

        // Generate report with issues
        const results = {
            elements: elements,
            issues: issues
        };

        const report = generateValidationReport(results);
        expect(report.status).toBe('warning');
        expect(report.totalElements).toBe(3);
        expect(report.issues.length).toBeGreaterThan(0);
    });
}); 