"""Validate an export against the official BCF 2.1 schemas (requires lxml)."""
import sys
from pathlib import Path
from zipfile import ZipFile
from lxml import etree

root = Path(__file__).parent
schemas = {name: etree.XMLSchema(etree.parse(str(root / 'bcf-schemas' / (name + '.xsd'))))
           for name in ('markup', 'visinfo', 'version')}
archive = sys.argv[1] if len(sys.argv) > 1 else root / 'bcf-output/test.bcfzip'
with ZipFile(archive) as package:
    assert package.testzip() is None
    for name in package.namelist():
        if name.endswith('.png'):
            assert package.read(name).startswith(b'\x89PNG\r\n\x1a\n')
            continue
        kind = 'markup' if name.endswith('markup.bcf') else 'visinfo' if name.endswith('.bcfv') else 'version'
        document = etree.fromstring(package.read(name))
        schemas[kind].assertValid(document)
        if kind == 'markup':
            for element in document.findall('Viewpoints/*'):
                if element.tag in ('Viewpoint', 'Snapshot'):
                    assert str(Path(name).parent / element.text).replace('\\', '/') in package.namelist()
        print('Valid:', name)
