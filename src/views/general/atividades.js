import jsPDF from "jspdf";

export function gerarPDF(data) {
    // Crie uma instância do jsPDF
    const pdf = new jsPDF();

    let texto = 'ATIVIDADES - SISTEMA CAPOP';

    const larguraPagina = pdf.internal.pageSize.getWidth();

    // Calcula a posição X para centralizar o texto
    const larguraTexto = pdf.getTextWidth(texto);
    const posX = (larguraPagina - larguraTexto) / 2;

    //pdf.text(texto, posX, 10);
    pdf.text(texto, larguraPagina/2, 10, null, null, "center");

    let oldProg = '';
    let ln = 14;
    let col = 15;
    let inc = 4;
    let cellStart = 10; 
    pdf.setFontSize(6);

    for (const linha of data.dados) {
        ln = ln + inc;
        if (linha['programa'] == oldProg){
            pdf.text(linha['codigo'] + ' - ' + linha['atividade'],col,ln);
            poeBorda(pdf, ln, cellStart);
        } else {   
            ln = ln - 3;
            if (linha['id_programa'] == 5){
                pdf.line(cellStart, ln+1, cellStart+55, ln+1);
                ln = 15;
                col = 75;
                cellStart = 70;
            } else if(linha['id_programa'] == 9){
                pdf.line(cellStart, ln+1, cellStart+55, ln+1);
                ln+=10;
                pdf.setFontSize(9);
                pdf.text('Atualizado em: ' + data.date,col,ln);
                pdf.setFontSize(6);
                ln = 15;
                col = 135;
                cellStart = 130;
            } else if(linha['id_programa'] > 1) {
                poeBorda(pdf, ln, cellStart);
            }
            pdf.setFont("arial", "bold");       
            pdf.cell(cellStart,ln,55,6,linha['id_programa'] + ' - ' + linha['programa']);
            oldProg = linha['programa'];
            ln = ln + inc*2;
            pdf.setFont("arial", "normal");       
            pdf.text(linha['codigo'] + ' - ' + linha['atividade'],col,ln);
            poeBorda(pdf, ln, cellStart);
        }
        
    };
    pdf.line(cellStart, ln+2, cellStart+55, ln+2);
    ln+=3;
    pdf.setFont("arial", "bold");       
    pdf.cell(cellStart,ln,55,6,'Modalidades');
            
    ln = ln + inc*2;
    pdf.setFont("arial", "normal");       
            
    for (const linha of data.mods) {
        pdf.text(linha['codigo'] + ' - ' + linha['modalidade'],col,ln);
        poeBorda(pdf, ln, cellStart);
        ln = ln + inc;
    }
    ln = ln - inc;
    pdf.line(cellStart, ln+2, cellStart+55, ln+2);
    ln+=3;
    pdf.setFont("arial", "bold");       
    pdf.cell(cellStart,ln,55,6,'Perdas');
            
    ln = ln + inc*2;
    pdf.setFont("arial", "normal");       
            
    for (const linha of data.perdas) {
        pdf.text(linha['codigo'] + ' - ' + linha['perda'],col,ln);
        poeBorda(pdf, ln, cellStart);
        ln = ln + inc;
    }
    ln = ln - inc;
    pdf.line(cellStart, ln+2, cellStart+55, ln+2);
    // Baixe o PDF 
    pdf.output('dataurlnewwindow',{filename:'Códigos.pdf'});
  }

  function poeBorda(pdf, x, cellStart){
    pdf.line(cellStart, x-5, cellStart, x+2);
    cellStart += 55;
    pdf.line(cellStart, x-5, cellStart, x+2);
  }