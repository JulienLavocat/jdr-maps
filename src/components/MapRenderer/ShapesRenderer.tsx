import React, { useContext } from "react";
import { Circle } from "react-leaflet";
import { ShapeData } from "../../hooks/useRoom";
import { CurrentRoomCtx } from "../../pages/Room/index";
import {} from "leaflet-draw";

export default function ShapesRenderer({ shapes }: { shapes: ShapeData[] }) {
	const { removeShape } = useContext(CurrentRoomCtx);

	return (
		<React.Fragment>
			{shapes.map((shape) => {
				switch (shape.type) {
					case "circle":
						return (
							<Circle
								key={shape.id}
								eventHandlers={{
									remove: () => {
										removeShape(shape.id);
									},
									dblclick: () => {
										removeShape(shape.id);
									},
								}}
								center={shape.pos}
								color={shape.color}
								radius={shape.shape.radius}
							></Circle>
						);

					default:
						break;
				}
			})}
		</React.Fragment>
	);
}
