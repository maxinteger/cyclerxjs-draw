import {map, merge} from 'ramda';
import {ul, li, span} from '@cycle/dom';

export const colorSelector = (DOM, colors) => {
    const select_ = DOM
        .select('li.color-selector')
        .events('mouseup')
        .map( evt => ({ [evt.button <= 1 ? 'bg': 'fg']: evt.target.dataset.color }))
        .startWith( {fg: '#ffffff', bg: '#000000' } )
        .scan(merge);

    return {
        select_,
        DOM: select_
            .map( ({fg, bg}) =>
                ul('.container.colors',
                    [].concat(
                        li('.selected-colors', [
                            span('.item.bg', {style: {background: bg}}),
                            span('.item.fg', {style: {background: fg}})
                        ]),
                        map( c => li('.item.color-selector', {dataset: {color: c}, style: {backgroundColor: c}}), colors)
                    )
                )
            )
    }
};
