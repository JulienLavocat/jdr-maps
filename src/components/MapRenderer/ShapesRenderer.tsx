import React, { useContext } from "react";
import { Circle } from "react-leaflet";
import { ShapeData } from "../../hooks/useRoom";
import { CurrentRoomCtx } from "../../pages/Room/index";
import { COLORS_DETAILS } from "./MarkerIcons";

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
								color={COLORS_DETAILS[shape.color].outside}
								fillColor={COLORS_DETAILS[shape.color].inside}
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
