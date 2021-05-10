import { EventedProps, createLayerComponent } from "@react-leaflet/core";
import {
	LatLngExpression,
	Marker as LeafletMarker,
	MarkerOptions,
} from "leaflet";
import { ReactNode } from "react";
import {
	RotatedMarker as LibMarker,
	RotatedMarkerOptions as LibMarkerOptions,
} from "leaflet-marker-rotation";

export interface RotatedMarkerProps extends LibMarkerOptions, EventedProps {
	children?: ReactNode;
	position: LatLngExpression;
}

export const RotatedMarker = createLayerComponent<
	LibMarker,
	RotatedMarkerProps
>(
	function createMarker({ position, ...options }, ctx) {
		const instance = new LibMarker(position, options);

		return { instance, context: { ...ctx, overlayContainer: instance } };
	},
	function updateMarker(marker, props, prevProps) {
		if (props.position !== prevProps.position) {
			marker.setLatLng(props.position);
		}
		if (props.icon != null && props.icon !== prevProps.icon) {
			marker.setIcon(props.icon);
		}
		if (
			props.zIndexOffset != null &&
			props.zIndexOffset !== prevProps.zIndexOffset
		) {
			marker.setZIndexOffset(props.zIndexOffset);
		}
		if (props.opacity != null && props.opacity !== prevProps.opacity) {
			marker.setOpacity(props.opacity);
		}
		if (
			marker.dragging != null &&
			props.draggable !== prevProps.draggable
		) {
			if (props.draggable === true) {
				marker.dragging.enable();
			} else {
				marker.dragging.disable();
			}
		}
		if (
			props.rotationAngle &&
			props.rotationAngle !== prevProps.rotationAngle
		)
			marker.setRotationAngle(props.rotationAngle);
	},
);
