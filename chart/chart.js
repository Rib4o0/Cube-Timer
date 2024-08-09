const body = document.querySelector('body');

export function createChart(Arr, title, nums = false, container = body) {
    const chart = document.createElement('div');
    chart.classList.add('chart')
    // if (Arr.length > 20) chart.style.width = 10 * Arr.length + "px";
    container.append(chart)
    const chartLabel = document.createElement('label');
    chartLabel.classList.add('chartLabel')
    chartLabel.textContent = title;
    chart.append(chartLabel)
    const lines = document.createElement('div');
    lines.classList.add('lines');
    chart.append(lines);
    let max = getMax(Arr);
    for (let i = 0; i < Arr.length; i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        lines.append(line);
        if (nums) {
            const num = document.createElement('div');
            num.classList.add('num');
            num.textContent = i + 1;
            line.append(num);
        }
        const filler = document.createElement('div');
        filler.classList.add('filler');
        line.append(filler);
        const fill = document.createElement('div');
        fill.classList.add('fill');
        fill.style.height = Arr[i] / max * 100 + '%';
        filler.append(fill)
    }
}

function getMax(Arr) {
    let max = -Infinity;
    for (let i = 0; i < Arr.length; i++) {
        if (max < Arr[i]) max = Arr[i];
    }
    return max;
}