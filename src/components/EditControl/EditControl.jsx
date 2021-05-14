// Refactored v3 EditControl.js file
import { useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';
import * as Draw from 'leaflet-draw'; // eslint-disable-line
import isEqual from 'lodash.isequal';

import { useLeafletContext } from '@react-leaflet/core';
import leaflet, { Map, Control } from 'leaflet';

const eventHandlers = {
	onEdited: 'draw:edited',
	onDrawStart: 'draw:drawstart',
	onDrawStop: 'draw:drawstop',
	onDrawVertex: 'draw:drawvertex',
	onEditStart: 'draw:editstart',
	onEditMove: 'draw:editmove',
	onEditResize: 'draw:editresize',
	onEditVertex: 'draw:editvertex',
	onEditStop: 'draw:editstop',
	onDeleted: 'draw:deleted',
	onDeleteStart: 'draw:deletestart',
	onDeleteStop: 'draw:deletestop',
};

function EditControl(props) {
	const context = useLeafletContext()
	const controlRef = useRef()
	const propsRef = useRef(props)

	const onDrawCreate = (e) => {
		context.layerContainer.addLayer(e.layer);
		props.onCreated && props.onCreated(e);
	};

	useEffect(() => {
		for (const key in eventHandlers) {
			context.map.on(eventHandlers[key], (evt) => {
				let handlers = Object.keys(eventHandlers).filter(handler => eventHandlers[handler] === evt.type);
				if (handlers.length === 1) {
					let handler = handlers[0];
					props[handler] && props[handler](evt);
				}
			})
		}

		context.map.on(leaflet.Draw.Event.CREATED, onDrawCreate);
		const options = {
			edit: {
				...props.edit,
				featureGroup: context.layerContainer
			}
		}
		if (props.draw) {
			options.draw = { ...props.draw };
		}
		if (props.position) {
			options.position = props.position;
		}

		controlRef.current = new Control.Draw(options);
		controlRef.current.addTo(context.map);
		props.onMounted && props.onMounted(controlRef.current);

		return () => {
			context.map.off(leaflet.Draw.Event.CREATED, onDrawCreate);

			for (const key in eventHandlers) {
				if (props[key]) {
					context.map.off(eventHandlers[key], props[key]);
				}
			}
		}
	}, [])

	useEffect(() => {
		// If the props haven't changed, don't update
		if (
			isEqual(props.draw, propsRef.current.draw)
			&& isEqual(props.edit, propsRef.current.edit)
			&& props.position === propsRef.current.position
		) {
			return false;
		}

		const options = {
			edit: {
				...props.edit,
				featureGroup: context.layerContainer
			}
		}
		if (props.draw) {
			options.draw = { ...props.draw };
		}
		if (props.position) {
			options.position = props.position;
		}

		controlRef.current.remove(context.map);
		controlRef.current = new Control.Draw(options);
		controlRef.current.addTo(context.map);

		// Remount the new draw control
		props.onMounted && props.onMounted(controlRef.current);
		propsRef.current = props
	}, [props.draw, props.edit, props.position])

	return null;
}

EditControl.propTypes = {
	...Object.keys(eventHandlers).reduce((acc, val) => {
		acc[val] = PropTypes.func;
		return acc;
	}, {}),
	onCreated: PropTypes.func,
	onMounted: PropTypes.func,
	draw: PropTypes.shape({
		polyline: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
		polygon: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
		rectangle: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
		circle: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
		marker: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
	}),
	edit: PropTypes.shape({
		edit: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
		remove: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
		poly: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
		allowIntersection: PropTypes.bool,
	}),
	position: PropTypes.oneOf([
		'topright',
		'topleft',
		'bottomright',
		'bottomleft'
	]),
};

export default EditControl;