import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Control, DomUtil } from 'leaflet';
import { MapControl, withLeaflet } from 'react-leaflet';

class Legend extends MapControl {

  createLeafletElement(_props) {

    const riskValues = [
      {
        name: 'Low',
        className: 'risk-LOW',
      },
      {
        name: 'Medium',
        className: 'risk-MEDIUM',
      },
      {
        name: 'Med-High',
        className: 'risk-MEDIUM_HIGH',
      },
      {
        name: 'High',
        className: 'risk-HIGH',
      },

    ];

    const content = ([
        <h4>Runoff Risk</h4>,
        <ul>
          {riskValues.map((rv) => (
            <li key={rv.className} className={rv.className}>
              {rv.name}
            </li>
          ))}
        </ul>]
    );

    class LL extends Control {

      onAdd(map) {
        const l = DomUtil.create('div', 'legend');
        l.innerHTML = ReactDOMServer.renderToString(content);
        return l;
      }

      onRemove(map) {
      }
    }

    return new LL({ position: 'bottomleft' }, _props.leafletElement);
  }
}

export default withLeaflet(Legend);
