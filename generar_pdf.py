from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 16)
        self.set_text_color(30, 41, 59)
        self.cell(0, 12, 'Comparativa: Web Speech API vs Gemini API', new_x="LMARGIN", new_y="NEXT", align='C')
        self.ln(8)

    def footer(self):
        pass

pdf = PDF()
pdf.set_auto_page_break(auto=True, margin=20)
pdf.add_page()

# Colores
DARK = (15, 23, 42)
PRIMARY = (79, 70, 229)
ACCENT = (6, 182, 212)
LIGHT_BG = (241, 245, 249)
WHITE = (255, 255, 255)
TEXT_DARK = (30, 41, 59)
TEXT_MID = (100, 116, 139)

# Anchos de columna
col_w = [55, 67, 67]

# Cabecera
pdf.set_font('Helvetica', 'B', 11)
pdf.set_fill_color(*PRIMARY)
pdf.set_text_color(*WHITE)
headers = ['Aspecto', 'Web Speech API', 'Gemini API']
for i, h in enumerate(headers):
    pdf.cell(col_w[i], 10, h, border=1, fill=True, align='C')
pdf.ln()

# Datos
data = [
    ['Velocidad', 'Tiempo real (streaming)', 'Segundos (batch)'],
    ['Precision', 'Buena', 'Muy alta'],
    ['Idiomas', '~50', '100+'],
    ['Ruido / Acentos', 'Sensible', 'Robusto'],
    ['Costo', 'Gratis ilimitado', 'Gratis con rate limit'],
    ['Infraestructura', 'Solo navegador', 'Requiere API key + red'],
    ['Audio largo', 'Problemas >1-2 min', 'Soporta bien'],
    ['Entrada', 'Microfono en vivo', 'Archivos (wav/mp3/m4a)'],
    ['Privacidad', 'Local (navegador)', 'Envía a Google'],
    ['Navegadores', 'Chrome/Edge/Safari', 'Universal'],
]

pdf.set_font('Helvetica', '', 10)
fill = False
for row in data:
    if fill:
        pdf.set_fill_color(*LIGHT_BG)
    else:
        pdf.set_fill_color(*WHITE)
    
    pdf.set_text_color(*TEXT_DARK)
    
    # Calcular altura necesaria
    max_lines = 1
    for i, cell in enumerate(row):
        lines = pdf.multi_cell(col_w[i], 6, cell, border=0, split_only=True)
        max_lines = max(max_lines, len(lines))
    
    row_h = max(10, max_lines * 6)
    
    # Verificar salto de pagina
    if pdf.get_y() + row_h > pdf.h - 20:
        pdf.add_page()
    
    y_start = pdf.get_y()
    x_start = pdf.get_x()
    
    for i, cell in enumerate(row):
        x = x_start + sum(col_w[:i])
        pdf.set_xy(x, y_start)
        pdf.set_fill_color(*LIGHT_BG if fill else WHITE)
        pdf.rect(x, y_start, col_w[i], row_h, style='DF')
        pdf.set_xy(x + 1, y_start + 1)
        pdf.multi_cell(col_w[i] - 2, 6, cell, border=0, align='L')
    
    pdf.set_y(y_start + row_h)
    fill = not fill

output_path = r'C:\Users\yaser.castillon.ext\Desktop\Voz_Interfaz\comparativa_web_speech_vs_gemini.pdf'
pdf.output(output_path)
print(f'PDF generado: {output_path}')