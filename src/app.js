import {Observable} from 'rx';
import Cycle from '@cycle/core';
import {div, ul, li, button, canvas, span, makeDOMDriver} from '@cycle/dom';
import {head, tail, pipe, curry, map, concat, min, max, merge, mergeAll} from 'ramda';

import {colorSelector} from './color-palette';
import {toolSelector} from './toolbar';

const toolList = [
    {name: 'line', label: 'Line'},
    {name: 'rect', label: 'Rectangle'},
    {name: 'ellipse', label: 'Ellipse'},
    {name: 'erase', label: 'Erase'}
];

const colorList = [ '#ffffff',  '#000000',  '#009f6b',  '#c40233',  '#ffd300',  '#0087bd'];


function main({DOM}) {
    const colorPalette = colorSelector(DOM, colorList);
    const toolBar = toolSelector(DOM, toolList);

    return {
        DOM: Observable
            .just(1)
            .map(name =>
                div([
                    toolBar.DOM,
                    canvas('#canvas', {width: 320, height: 200}),
                    colorPalette.DOM
                ])
            )
    };
}


Cycle.run(main, { DOM: makeDOMDriver('#app-container') });
/*

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const canvas = $('#canvas');
const ctx = canvas.getContext('2d');


const moveTo        = curry((ctx, {x,y}) => ctx.moveTo(x, y));
const lineTo        = curry((ctx, {x,y}) => ctx.lineTo(x, y));
const strokeRect    = curry((ctx, {x,y,w,h}) => ctx.strokeRect(x, y, w, h));
const ellipse       = curry((ctx, {x,y,rx,ry}) => ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI));
const clear         = ctx => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

const shape = curry((type, data) => ({type, data}) );


const colorSelectors = $$('.color-selector');
const bgColor = $('.selected-colors .bg');
const fgColor = $('.selected-colors .fg');

const selectedColor_ = Observable
    .fromEvent(colorSelectors, 'mouseup')
    .startWith( {color: {fg: '#ffffff', bg: '#000000' }} )
    .scan( (colors, evt) =>
        merge(colors, { color: {
            [evt.button <= 1 ? 'bg': 'fg']: evt.target.dataset.color
        } }));

const tools = $$('.tools .tool');

 const selectTool_ = Observable.fromEvent(tools, 'click')
 .map( evt => ({tool: evt.target.dataset.tool}) )
 .startWith({tool: 'line'});


const down_ = Observable.fromEvent(canvas, 'mousedown');
const up_ =  Observable.fromEvent(canvas, 'mouseup');
const move_ = Observable.fromEvent(canvas, 'mousemove');

const mouseRightBtnUp_ = up_.filter( evt => evt.button === 2);

const mousePos =  evt => ({x: evt.layerX, y: evt.layerY, });

const downPos_ = down_.map(mousePos);
const upPos_ = up_.map(mousePos);
const movePos_ = move_.map(mousePos);


const drawLineStrip_ = upPos_.map( x => [x])
    .scan( concat , [])
    .flatMap( points =>
        movePos_
            .map( concat(points) )
            .takeUntil(up_)
    )
    .map( shape('line') )
    .combineLatest(selectedColor_, merge)
    .takeUntil(mouseRightBtnUp_);

const drawRect_ = downPos_
    .flatMap( start =>
        movePos_
            .map( end => {
                const minX = min(start.x, end.x);
                const minY = min(start.y, end.y);
                const maxX = max(start.x, end.x);
                const maxY = max(start.y, end.y);
                return { x: minX, y: minY, w: maxX-minX, h: maxY-minY };
            })
    )
    .map( shape('rect') )
    .takeUntil(up_);

const drawEllipse_ = downPos_
    .flatMap( start =>
        movePos_
            .map( end => {
                const minX = min(start.x, end.x);
                const minY = min(start.y, end.y);
                const maxX = max(start.x, end.x);
                const maxY = max(start.y, end.y);
                const rx = (maxX-minX) / 2;
                const ry = (maxY-minY) / 2;
                return { x: minX + rx, y: minY + ry, rx, ry};
            })
    )
    .map( shape('ellipse') )
    .takeUntil(up_);

//const app_ = Observable.empty().startWith({objects: []}).share();

Observable.combineLatest(
    selectedColor_,
    selectTool_,
    selectTool_
        .flatMapLatest( ({tool}) => {
            let s_ = Observable.empty();
            switch (tool) {
                case 'line': s_ = drawLineStrip_; break;
                case 'rect': s_ = drawRect_; break;
                case 'ellipse': s_ = drawEllipse_; break;
            }
            return s_.map( x => ({drawing: x}) );
        }),
    (...args) => mergeAll(args)
)
    .subscribe(function(scene){
        console.log(scene);

        clear(ctx);

        bgColor.style.background = scene.color.bg;
        fgColor.style.background = scene.color.fg;

        map(x => x.classList.remove('active'), tools);
        $(`[data-tool=${scene.tool}]`).classList.add('active');

        var drawing = scene.drawing || {};
        switch (drawing.type){
            case 'line':
                ctx.beginPath();
                ctx.strokeStyle = drawing.color.bg;
                moveTo(ctx, head(drawing.data));
                pipe(tail, map( lineTo(ctx)) )(drawing.data);
                ctx.stroke();
                break;
            case 'ellipse':
                ctx.beginPath();
                ellipse(ctx, drawing.data);
                ctx.stroke();
                break;
            case 'rect':
                ctx.beginPath();
                strokeRect(ctx, drawing.data);
                ctx.stroke();
                break;

            default: console.log(`Invalid type: ${drawing.type}`);
        }
    });
*/