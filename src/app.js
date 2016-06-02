import {Observable} from 'rx';
import Cycle from '@cycle/core';
import {div, ul, li, button, canvas, span, makeDOMDriver} from '@cycle/dom';
import {head, tail, pipe, curry, map, concat, min, max, merge, mergeAll} from 'ramda';

import {colorSelector} from './color-palette';
import {toolSelector} from './toolbar';

const toolList = [
    {name: 'brush', label: 'Brush'},
    {name: 'line', label: 'Line'},
    {name: 'rect', label: 'Rectangle'},
    {name: 'ellipse', label: 'Ellipse'},
    {name: 'erase', label: 'Erase'}
];

const colorList = [ '#ffffff',  '#000000',  '#009f6b',  '#c40233',  '#ffd300',  '#0087bd'];


const mousePos =  evt => ({x: evt.layerX, y: evt.layerY, });

const moveTo        = curry((ctx, {x,y}) => ctx.moveTo(x, y));
const lineTo        = curry((ctx, {x,y}) => ctx.lineTo(x, y));
const strokeRect    = curry((ctx, {x,y,w,h}) => ctx.strokeRect(x, y, w, h));
const ellipse       = curry((ctx, {x,y,rx,ry}) => ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI));
const clear         = ctx => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


function main({DOM}) {
    const colorPalette = colorSelector(DOM, colorList);
    const toolBar = toolSelector(DOM, toolList);

	const down_ = DOM.select('#canvas').events('mousedown').map( mousePos );
	const move_ = DOM.select('#canvas').events('mousemove').map( mousePos );
	const up_ = DOM.select('#canvas').events('mouseup').map( mousePos );

	const $ = document.querySelector.bind(document);
	const $$ = document.querySelectorAll.bind(document);


	const brush_ = down_
		.flatMap( x =>
			move_
				.bufferCount(2, 1)
				.takeUntil(up_)
		)
		.map( points => ({points}) );
	
	
	Observable.combineLatest(
			colorPalette.select_.map( color => ({color})),
			brush_,
			(...args) => mergeAll(args)
		)
		.subscribe(({color, points: [p1, p2]}) => {
		const canvas = $('#canvas');
		const ctx = canvas.getContext('2d');

		ctx.strokeStyle = color.bg;
		ctx.beginPath();

		const minX = min(p1.x, p2.x);
		const minY = min(p1.y, p2.y);
		const maxX = max(p1.x, p2.x);
		const maxY = max(p1.y, p2.y);
		const x = (maxX-minX);
		const y = (maxY-minY);
		const r = Math.sqrt(x*x + y*y) / 2;
		ellipse(ctx, {x: minX + x/2, y: minY + y/2, rx: r, ry: r});
		ctx.stroke();
	});

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
