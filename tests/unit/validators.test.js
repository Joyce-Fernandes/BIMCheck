/**
 * IFC File Validators - Unit Test Suite
 * Comprehensive unit testing for IFC file validation functions
 */

// Mock validation functions (for demonstration)
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
    
    const dims = dimensions.value.split('x').map(d => parseFloat(d));
    return dims.every(d => d > 0);
};

const validateNormCode = (element) => {
    if (!element || !element.properties) return false;
    const normCode = element.properties.normCode;
    if (!normCode || !normCode.value) return false;
    
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

        test('should reject file exceeding size limit', () => {
            const invalidFile = { size: 150 * 1024 * 1024 }; // 150MB
            expect(validateFileSize(invalidFile)).toBe(false);
        });

        test('should reject null file', () => {
            expect(validateFileSize(null)).toBe(false);
        });

        test('should accept small file', () => {
            const validFile = { size: 1024 }; // 1KB
            expect(validateFileSize(validFile)).toBe(true);
        });
    });

    describe('validateIFCContent', () => {
        test('should accept file with valid IFC content', async () => {
            const validFile = createMockIFCFile('test.ifc');
            const result = await validateIFCContent(validFile);
            expect(result).toBe(true);
        });

        test('should reject file without IFC content', async () => {
            const invalidFile = createMockIFCFile('test.txt');
            const result = await validateIFCContent(invalidFile);
            expect(result).toBe(false);
        });
    });
});

describe('BIM Element Property Validation', () => {
    describe('validateMaterial', () => {
        test('should accept element with defined material', () => {
            const element = {
                properties: {
                    material: { value: 'Concrete' }
                }
            };
            expect(validateMaterial(element)).toBe(true);
        });

        test('should reject element without material', () => {
            const element = {
                properties: {}
            };
            expect(validateMaterial(element)).toBe(false);
        });

        test('should reject element with empty material', () => {
            const element = {
                properties: {
                    material: { value: '' }
                }
            };
            expect(validateMaterial(element)).toBe(false);
        });

        test('should reject null element', () => {
            expect(validateMaterial(null)).toBe(false);
        });
    });

    describe('validateDimensions', () => {
        test('should accept element with valid dimensions', () => {
            const element = {
                properties: {
                    dimensions: { value: '100x200x300' }
                }
            };
            expect(validateDimensions(element)).toBe(true);
        });

        test('should reject element with zero dimension', () => {
            const element = {
                properties: {
                    dimensions: { value: '0x200x300' }
                }
            };
            expect(validateDimensions(element)).toBe(false);
        });

        test('should reject element without dimensions', () => {
            const element = {
                properties: {}
            };
            expect(validateDimensions(element)).toBe(false);
        });
    });

    describe('validateNormCode', () => {
        test('should accept European norm code', () => {
            const element = {
                properties: {
                    normCode: { value: 'EN 1992-1-1' }
                }
            };
            expect(validateNormCode(element)).toBe(true);
        });

        test('should accept ISO norm code', () => {
            const element = {
                properties: {
                    normCode: { value: 'ISO 9001' }
                }
            };
            expect(validateNormCode(element)).toBe(true);
        });

        test('should reject element without norm code', () => {
            const element = {
                properties: {}
            };
            expect(validateNormCode(element)).toBe(false);
        });

        test('should accept ASTM norm code', () => {
            const element = {
                properties: {
                    normCode: { value: 'ASTM E1557' }
                }
            };
            expect(validateNormCode(element)).toBe(true);
        });
    });
});

describe('Validation Report Generation', () => {
    describe('generateValidationReport', () => {
        test('should generate report with valid elements', () => {
            const results = {
                elements: [{ id: 1 }, { id: 2 }],
                issues: []
            };
            const report = generateValidationReport(results);
            expect(report.totalElements).toBe(2);
            expect(report.issues).toHaveLength(0);
            expect(report.status).toBe('success');
        });

        test('should generate report with identified issues', () => {
            const results = {
                elements: [{ id: 1 }],
                issues: ['Missing material', 'Invalid dimensions']
            };
            const report = generateValidationReport(results);
            expect(report.totalElements).toBe(1);
            expect(report.issues).toHaveLength(2);
            expect(report.status).toBe('warning');
        });

        test('should generate report with current timestamp', () => {
            const results = {
                elements: [],
                issues: []
            };
            const report = generateValidationReport(results);
            expect(report.timestamp).toBeDefined();
            expect(new Date(report.timestamp)).toBeInstanceOf(Date);
        });
    });
});

describe('Validator Integration Testing', () => {
    test('should validate complete IFC file successfully', () => {
        const file = createMockIFCFile('test.ifc', 1024);
        const element = {
            properties: {
                material: { value: 'Concrete' },
                dimensions: { value: '100x200x300' },
                normCode: { value: 'EN 1992-1-1' }
            }
        };

        expect(validateFileExtension(file)).toBe(true);
        expect(validateFileSize(file)).toBe(true);
        expect(validateMaterial(element)).toBe(true);
        expect(validateDimensions(element)).toBe(true);
        expect(validateNormCode(element)).toBe(true);
    });

    test('should detect issues in IFC file validation', () => {
        const file = createMockIFCFile('test.txt', 150 * 1024 * 1024);
        const element = {
            properties: {
                material: { value: '' },
                dimensions: { value: '0x200x300' },
                normCode: { value: 'INVALID' }
            }
        };

        expect(validateFileExtension(file)).toBe(false);
        expect(validateFileSize(file)).toBe(false);
        expect(validateMaterial(element)).toBe(false);
        expect(validateDimensions(element)).toBe(false);
        expect(validateNormCode(element)).toBe(false);
    });
}); 