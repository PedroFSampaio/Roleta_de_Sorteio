// Função para converter graus em radianos
function toRad(deg) {
    return deg * (Math.PI / 180.0);
}

// Função de easing (suavização) para efeito de desaceleração
function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

// Função que retorna uma cor aleatória
function randomColor() {
    // Gera valores aleatórios para vermelho, verde e azul (RGB)
    r = Math.floor(Math.random() * 255);
    g = Math.floor(Math.random() * 255);
    b = Math.floor(Math.random() * 255);
    // Retorna um objeto com os valores de RGB
    return {r, g, b}
}

// Função que retorna um número aleatório entre dois valores (inclusive)
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função que retorna a porcentagem de um valor entre um mínimo e máximo
function getPercent(input, min, max) {
    return (((input - min) * 100) / (max - min)) / 100;
}

// Obtém o elemento canvas pelo ID e define o contexto 2D do canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Obtém as dimensões do canvas
const width = canvas.width;
const height = canvas.height;

// Define o centro do canvas e o raio (metade da largura do canvas)
const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

// Variáveis de controle para a rotação da roleta
let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6); // Rotação máxima aleatória
let pause = false; // Variável para pausar a animação

// Obtém os itens da textarea, divididos por linha
let items = document.getElementsByTagName("textarea")[0].value.split("\n");
let currentDeg = 0;
let step = 360 / items.length; // Calcula o passo (ângulo) entre cada item na roleta
let colors = [];
let itemDegs = {};

// Função para criar a roleta (redefinir itens e cores)
function createWheel() {
    // Atualiza os itens a partir da textarea
    items = document.getElementsByTagName("textarea")[0].value.split("\n");
    // Recalcula o passo de ângulo
    step = 360 / items.length;
    // Limpa o array de cores e gera novas cores
    colors = [];
    for (let i = 0; i < items.length + 1; i++) {
        colors.push(randomColor());
    }
    // Chama a função de desenho
    draw();
}

// Gera cores aleatórias para os itens
for (let i = 0; i < items.length + 1; i++) {
    colors.push(randomColor());
}

// Função responsável por desenhar a roleta
function draw() {
    // Desenha o círculo de fundo da roleta
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
    ctx.fillStyle = `rgb(${33},${33},${33})`; // Cor do fundo
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Ângulo inicial
    let startDeg = currentDeg;

    // Loop para desenhar cada item na roleta
    for (let i = 0; i < items.length; i++, startDeg += step) {
        // Define o ângulo final para o item atual
        let endDeg = startDeg + step;

        // Obtém a cor para o item atual
        color = colors[i];
        let colorStyle = `rgb(${color.r},${color.g},${color.b})`;

        // Desenha a seção de cor mais escura
        ctx.beginPath();
        rad = toRad(360 / step);
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        let colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;
        ctx.fillStyle = colorStyle2;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Desenha a seção de cor mais clara
        ctx.beginPath();
        rad = toRad(360 / step);
        ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colorStyle;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Desenha o texto do item na roleta
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(toRad((startDeg + endDeg) / 2));
        ctx.textAlign = "center";

        // Define a cor do texto com base no brilho da cor de fundo
        if (color.r > 150 || color.g > 150 || color.b > 150) {
            ctx.fillStyle = "#000"; // Texto escuro
        } else {
            ctx.fillStyle = "#fff"; // Texto claro
        }

        ctx.font = 'bold 24px serif';
        ctx.fillText(items[i], 130, 10);
        ctx.restore();

        // Armazena os ângulos de início e fim de cada item
        itemDegs[items[i]] = {
            "startDeg": startDeg,
            "endDeg": endDeg
        };

        // Verifica se o item atual está na posição de ganhador (topo da roleta)
        if (startDeg % 360 < 360 && startDeg % 360 > 270 && endDeg % 360 > 0 && endDeg % 360 < 90) {
            document.getElementById("Ganhador").innerHTML = items[i]; // Exibe o item vencedor
        }
    }
}

// Função para iniciar o giro da roleta
function spin() {
    // Verifica se a roleta já está girando (se a velocidade for diferente de zero)
    if (speed !== 0) {
        return;
    }

    // Reseta o status para permitir o giro novamente
    speed = 0;
    pause = false;

    // Redefine o valor de rotação máxima e o ângulo atual
    maxRotation = randomRange(360 * 3, 360 * 6); // Gira entre 3 a 6 voltas
    currentDeg = 0;

    // Redesenha a roleta com os itens da textarea
    createWheel();
    draw();

    // Inicia a animação
    window.requestAnimationFrame(animate);
}

// Função de animação para girar a roleta
function animate() {
    // Se a rotação estiver pausada, interrompe a animação
    if (pause) {
        return;
    }
    // Calcula a velocidade com base na função de easing
    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
    // Se a velocidade for muito baixa, para a rotação
    if (speed < 0.01) {
        speed = 0;
        pause = true; // Pausa a rotação quando o giro termina
        return;
    }
    // Incrementa o ângulo atual com base na velocidade
    currentDeg += speed;
    // Chama a função de desenho para atualizar o canvas
    draw();
    // Chama a próxima animação no próximo frame
    window.requestAnimationFrame(animate);
}

// Desenha a roleta inicialmente
draw();
