import { useEffect, useRef, useState } from 'react';
import '../index.css';
import { isQualifiedName } from 'typescript';


const Room = () => {
    const [selectedColor, setSelectedColor] = useState('#008000') // Default to green
    const [selectedTool, setSelectedTool] = useState('pen')
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);

    // tracking the startpoint of a drawing for shapes and line tools
    const startPoint = useRef<{ x: number; y: number } | null>(null);

    // Store the previous position for drawing lines
    const lastPoint = useRef<{ x: number, y: number } | null>(null);

    // Storing snapshots to undo an redo
    const undoStack = useRef<ImageData[]>([]);
    const redoStack = useRef<ImageData[]>([]);

    let savedImage: ImageData | null = null;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Exit if canvas is null (e.g., component not yet mounted)

        // Setting canvas size once on mount
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const startDrawing = (e: MouseEvent) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!canvas || !ctx) return;

            if (selectedTool === 'fill') {
                saveState(); // Save state before the fill
                const x = e.offsetX;
                const y = e.offsetY;
                floodFill(canvas, ctx, x, y, selectedColor);
                return; // Exit early — no dragging involved for fill
            }

            saveState(); //Saves state for snapshots

            if (['pen', 'eraser'].includes(selectedTool)) {
                ctx.beginPath();
                ctx.moveTo(e.offsetX, e.offsetY);
                lastPoint.current = { x: e.offsetX, y: e.offsetY };
                isDrawingRef.current = true;
            } else if (['circle', 'circle_fill', 'square', 'square_fill', 'line'].includes(selectedTool)) {
                savedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
                startPoint.current = { x: e.offsetX, y: e.offsetY };
                isDrawingRef.current = true;
            }
        };

        // const draw = (e: MouseEvent) => {
        //     if (!isDrawingRef.current) return;

        //     if (['pen', 'eraser'].includes(selectedTool)) {
        //         // existing freehand draw logic
        //         ctx.lineJoin = 'round';
        //         ctx.lineCap = 'round';
        //         ctx.strokeStyle = selectedColor;
        //         ctx.lineWidth = selectedTool === 'eraser' ? 15 : 5;
        //         ctx.globalCompositeOperation = selectedTool === 'eraser' ? 'destination-out' : 'source-over';

        //         ctx.lineTo(e.offsetX, e.offsetY);
        //         ctx.stroke();
        //     }
        // };

        const draw = (e: MouseEvent) => {
            if (!isDrawingRef.current) return;

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            if (['pen', 'eraser'].includes(selectedTool)) {
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.strokeStyle = selectedTool === 'eraser' ? 'white' : selectedColor;
                ctx.lineWidth = selectedTool === 'eraser' ? 15 : 5;
                ctx.globalCompositeOperation = selectedTool === 'eraser' ? 'destination-out' : 'source-over';

                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            } else if (startPoint.current && savedImage) {
                // Restore previous image for live shape preview
                ctx.putImageData(savedImage, 0, 0);

                const endPoint = { x: e.offsetX, y: e.offsetY };

                switch (selectedTool) {
                    case 'circle':
                    case 'circle_fill':
                        drawCircle(ctx, startPoint.current, endPoint, selectedTool === 'circle_fill', selectedColor);
                        break;
                    case 'square':
                    case 'square_fill':
                        drawSquare(ctx, startPoint.current, endPoint, selectedTool === 'square_fill', selectedColor);
                        break;
                    case 'line':
                        drawLine(ctx, startPoint.current, endPoint, selectedColor);
                        break;
                }
            }
        };



        // const stopDrawing = (e: MouseEvent) => {
        //     if (!isDrawingRef.current) return;
        //     isDrawingRef.current = false;

        //     if (['pen', 'eraser'].includes(selectedTool)) {
        //         ctx.closePath();
        //     } else if (startPoint.current) {
        //         const endPoint = { x: e.offsetX, y: e.offsetY };

        //         if (selectedTool === 'circle') {
        //             drawCircle(ctx, startPoint.current, endPoint, false, selectedColor);
        //         } else if (selectedTool === 'circle_fill') {
        //             drawCircle(ctx, startPoint.current, endPoint, true, selectedColor);
        //         } else if (selectedTool === 'square') {
        //             drawSquare(ctx, startPoint.current, endPoint, false, selectedColor);
        //         } else if (selectedTool === 'square_fill') {
        //             drawSquare(ctx, startPoint.current, endPoint, true, selectedColor);
        //         } else if (selectedTool === 'line') {
        //             drawLine(ctx, startPoint.current, endPoint, selectedColor);
        //         }

        //         startPoint.current = null;
        //     }
        // }

        const stopDrawing = (e: MouseEvent) => {
            if (!isDrawingRef.current) return;
            isDrawingRef.current = false;

            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;


            if (['pen', 'eraser'].includes(selectedTool)) {
                ctx.closePath();
            } else if (startPoint.current) {
                const endPoint = { x: e.offsetX, y: e.offsetY };

                if (selectedTool === 'circle') {
                    drawCircle(ctx, startPoint.current, endPoint, false, selectedColor);
                } else if (selectedTool === 'circle_fill') {
                    drawCircle(ctx, startPoint.current, endPoint, true, selectedColor);
                } else if (selectedTool === 'square') {
                    drawSquare(ctx, startPoint.current, endPoint, false, selectedColor);
                } else if (selectedTool === 'square_fill') {
                    drawSquare(ctx, startPoint.current, endPoint, true, selectedColor);
                } else if (selectedTool === 'line') {
                    drawLine(ctx, startPoint.current, endPoint, selectedColor);
                }

                startPoint.current = null;
                // savedImage = null; // clear saved image now that drawing is done
            }
        };


        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        // Clean up
        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
        };
    }, [selectedColor, selectedTool]);

    const saveState = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        redoStack.current = []; // clear redo on new action
    };

    function floodFill(
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        startX: number,
        startY: number,
        fillColor: string
    ) {
        const width = canvas.width;
        const height = canvas.height;
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const getColorAt = (x: number, y: number) => {
            const index = (y * width + x) * 4;
            return [data[index], data[index + 1], data[index + 2], data[index + 3]];
        };

        const setColorAt = (x: number, y: number, [r, g, b, a]: number[]) => {
            const index = (y * width + x) * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
        };

        const [targetR, targetG, targetB, targetA] = getColorAt(startX, startY);
        const [fillR, fillG, fillB] = hexToRgb(fillColor);
        const fillA = 255;

        if (targetR === fillR && targetG === fillG && targetB === fillB && targetA === fillA) return;

        const queue = [[startX, startY]];
        const visited = new Set();

        while (queue.length > 0) {
            const [x, y] = queue.pop()!;
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            visited.add(key);

            const [r, g, b, a] = getColorAt(x, y);
            if (r === targetR && g === targetG && b === targetB && a === targetA) {
                setColorAt(x, y, [fillR, fillG, fillB, fillA]);
                if (x > 0) queue.push([x - 1, y]);
                if (x < width - 1) queue.push([x + 1, y]);
                if (y > 0) queue.push([x, y - 1]);
                if (y < height - 1) queue.push([x, y + 1]);
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function hexToRgb(hex: string): [number, number, number] {
        hex = hex.replace('#', '');
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
    }


    const undo = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        if (undoStack.current.length === 0) return;

        const lastState = undoStack.current.pop();
        if (!lastState) return;

        redoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(lastState, 0, 0);
    };

    const redo = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        if (redoStack.current.length === 0) return;

        const lastRedo = redoStack.current.pop();
        if (!lastRedo) return;

        undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(lastRedo, 0, 0);
    };

    function drawCircle(ctx: CanvasRenderingContext2D, start: { x: number, y: number }, end: { x: number, y: number }, fill: boolean, color: string) {
        const radius = Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2);
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }
    }

    function drawSquare(ctx: CanvasRenderingContext2D, start: { x: number, y: number }, end: { x: number, y: number }, fill: boolean, color: string) {
        const width = end.x - start.x;
        const height = end.y - start.y;
        ctx.beginPath();
        if (fill) {
            ctx.fillStyle = color;
            ctx.fillRect(start.x, start.y, width, height);
        } else {
            ctx.strokeStyle = color;
            ctx.strokeRect(start.x, start.y, width, height);
        }
    }

    function drawLine(ctx: CanvasRenderingContext2D, start: { x: number, y: number }, end: { x: number, y: number }, color: string) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }


    const handleColorSelect = (color: string) => {
        setSelectedColor(color)
    }

    const handleToolSelect = (tool: string) => {
        setSelectedTool(tool)
    }
    return (
        <div className='room-container'>

            {/* Ad */}
            <div className='ad-row'></div>

            {/* Content */}
            <div className='content-container'>
                {/* Ad */}
                <div className='ad-column column-1'></div>
                <main className='drawing-container'>
                    <aside className='tools-panel'>
                        <div className='tool-section'>
                            <h3>Tools</h3>
                            <ul className='tools-list'>
                                <li
                                    className={`tool-item ${selectedTool === 'pen' ? 'selected' : ''}`}
                                    onClick={() => handleToolSelect('pen')}
                                >
                                    <img src='/icons/pen.svg' alt='Pen tool' className='icon-size' />
                                </li>
                                <li
                                    className={`tool-item ${selectedTool === 'eraser' ? 'selected' : ''}`}
                                    onClick={() => handleToolSelect('eraser')}
                                >
                                    <img src='/icons/eraser.svg' alt='Eraser tool' className='icon-size' />
                                </li>
                                <li
                                    className={`tool-item ${selectedTool === 'square' ? 'selected' : ''}`}
                                    onClick={() => handleToolSelect('square')}
                                >
                                    <img src='/icons/square.svg' alt='Square tool' className='icon-size' />
                                </li>
                                <li
                                    className={`tool-item ${selectedTool === 'square_fill' ? 'selected' : ''}`}
                                    onClick={() => handleToolSelect('square_fill')}
                                >
                                    <img src='/icons/square_fill.svg' alt='Filled square tool' className='icon-size' />
                                </li>
                                <li
                                    className={`tool-item ${selectedTool === 'circle' ? 'selected' : ''}`}
                                    onClick={() => handleToolSelect('circle')}
                                >
                                    <img src='/icons/circle.svg' alt='Circle tool' className='icon-size' />
                                </li>
                                <li
                                    className={`tool-item ${selectedTool === 'circle_fill' ? 'selected' : ''}`}
                                    onClick={() => handleToolSelect('circle_fill')}
                                >
                                    <img src='/icons/circle_fill.svg' alt='Filled circle tool' className='icon-size' />
                                </li>
                                <li
                                    className={`tool-item ${selectedTool === 'line' ? 'selected' : ''}`}
                                    onClick={() => handleToolSelect('line')}
                                >
                                    <img src='/icons/line.svg' alt='Line tool' className='icon-size' />
                                </li>
                                <li
                                    className={`tool-item ${selectedTool === 'fill' ? 'selected' : ''}`}
                                    onClick={() => handleToolSelect('fill')}
                                >
                                    <img src='/icons/fill.svg' alt='Fill tool' className='icon-size' />
                                </li>
                                <li className='tool-item' onClick={undo}>
                                    <img src='/icons/undo.svg' alt='Undo' className='icon-size' />
                                </li>
                                <li className='tool-item' onClick={redo}>
                                    <img src='/icons/redo.svg' alt='Redo' className='icon-size' />
                                </li>
                            </ul>
                            <div className='color-palette'>
                                {[
                                    '#FF0000',
                                    '#008000',
                                    '#B20000',
                                    '#005900',
                                    '#FFA500',
                                    '#0000FF',
                                    '#FFFF00',
                                    '#CC8400',
                                    '#0000B2',
                                    '#CCCC00',
                                    '#800080',
                                    '#00FFFF',
                                    '#590059',
                                    '#FFC0CB',
                                    '#00B2B2',
                                    '#CC99A2',
                                ].map((color) => (
                                    <div
                                        key={color}
                                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorSelect(color)}
                                    />
                                ))}
                                <div className='color-option custom-color'>
                                    <input
                                        type='color'
                                        id='colour-picker'
                                        value={selectedColor}
                                        onChange={(e) => handleColorSelect(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className='canvas-area'>

                        <div className='drawing-board'>
                            <canvas ref={canvasRef}></canvas>
                        </div>
                    </div>
                </main>

            </div>

            {/* Add */}
            <div className='ad-row'></div>
        </div>
    )
}

export default Room;