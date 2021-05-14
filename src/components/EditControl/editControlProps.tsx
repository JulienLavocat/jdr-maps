import { ControlPosition, DrawOptions } from "leaflet";

export interface EditControlProps {
	onEdited?: Function;
	onDrawStart?: Function;
	onDrawStop?: Function;
	onDrawVertex?: Function;
	onEditStart?: Function;
	onEditMove?: Function;
	onEditResize?: Function;
	onEditVertex?: Function;
	onEditStop?: Function;
	onDeleted?: Function;
	onDeleteStart?: Function;
	onDeleteStop?: Function;

	onCreated?: Function;
	onMounted?: Function;
	draw: {
		polyline?: DrawOptions.PolylineOptions | boolean;
		polygon?: DrawOptions.PolygonOptions | boolean;
		rectangle?: DrawOptions.RectangleOptions | boolean;
		circle?: DrawOptions.CircleOptions | boolean;
		marker?: DrawOptions.MarkerOptions | boolean;
		circlemarker?: DrawOptions.CircleOptions | boolean;
	};

	edit: any;
	position: ControlPosition;
}
