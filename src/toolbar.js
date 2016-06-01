import {map} from 'ramda';
import {ul, li, button} from '@cycle/dom';

export const toolSelector = (DOM, toolList) => {
    const tool_ = DOM
        .select('.tools button.tool')
        .events('click')
        .map( evt => ({tool: evt.target.dataset.tool}) )
        .startWith({tool: toolList[0].name });

    return {
        tool_,
        DOM: tool_.map( ({tool}) =>
            ul('.container.tools',
                map( item => li('.item', [
                    button('.tool', {type: 'button', className: tool === item.name ? 'active' : '', dataset: {tool: item.name} }, item.label)
                ]), toolList)
            )
        )
    }
};