import fitz
from pathlib import Path

pdf = fitz.open('attached_assets/Ayush_Sharma_Resume_1786593685365.pdf')
print('pages', pdf.page_count)
for i, page in enumerate(pdf):
    pix = page.get_pixmap(matrix=fitz.Matrix(2,2), alpha=False)
    out = Path('.agents/outputs') / f'resume-page-{i+1}.png'
    pix.save(out)
    print(out)
