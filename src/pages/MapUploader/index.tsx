import React, { useState, useEffect, ChangeEvent } from "react";

import MapsAPI from "../../utils/MapsAPI";
import { MapData } from "../../utils/MapsAPI";
import {
	Alert,
	Button,
	Card,
	Col,
	Container,
	Form,
	FormControl,
	InputGroup,
	ListGroup,
	ListGroupItem,
	ProgressBar,
	Row,
	Spinner,
} from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

import "./mapUploader.css";
import { useRecoilValue } from "recoil";
import { currentUniverseState } from "../../utils/state";

export default function MapUploader() {
	return (
		<div>
			<UploadFiles></UploadFiles>
		</div>
	);
}

function UploadFiles() {
	const universe = useRecoilValue(currentUniverseState);
	const [currentFile, setCurrentFile] = useState<File | null>(null);
	const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
	const [progress, setProgress] = useState(0);
	const [message, setMessage] = useState("");
	const [fileInfos, setFileInfos] = useState<MapData[]>([]);
	const [uploading, setUploading] = useState(false);
	const [mapName, setMapName] = useState("");

	useEffect(() => {
		MapsAPI.getMaps(universe.id).then((r) => {
			console.log(r);

			setFileInfos(r);
		});
		return () => {};
	}, []);

	const upload = async (e: any) => {
		e.preventDefault();

		if (!currentFile) return;
		setProgress(0);
		setUploading(true);
		try {
			const res = await MapsAPI.uploadMap(
				currentFile,
				mapName,
				universe.id,
				(progress) =>
					setProgress(
						Math.round((100 * progress.loaded) / progress.total),
					),
			);

			setMessage(res.message);
			setFileInfos(res.universe.maps);
		} catch (error) {
			setMessage("Could not upload the file ! " + error.message);
		}

		setUploading(false);
		setSelectedFiles(null);
		setCurrentFile(null);
		setProgress(0);
	};

	return (
		<Container fluid>
			{uploading && (
				<ProgressBar
					now={progress}
					variant="info"
					striped
					min={0}
					max={100}
					label={`${progress}%`}
				></ProgressBar>
			)}
			<Form onSubmit={upload}>
				<Col sm={2}>
					<Row>
						<InputGroup>
							<label className="btn btn-default">
								<FormControl
									type="file"
									onChange={(ev) => {
										const e = ev as any;
										setSelectedFiles(e.target.files);

										if (e.target.files)
											setCurrentFile(
												e.target.files[0] || null,
											);
									}}
								/>
							</label>
							<InputGroup.Append></InputGroup.Append>
						</InputGroup>
					</Row>

					<Row>
						<FormControl
							placeholder="Map name"
							value={mapName}
							required={true}
							onChange={(e) => setMapName(e.target.value)}
						/>
					</Row>
					<Row>
						<Button
							className="btn btn-success"
							disabled={!currentFile}
							type="submit"
						>
							Upload
						</Button>
					</Row>
				</Col>
			</Form>

			<Alert variant="light">{message}</Alert>

			<Card>
				<Card.Header>List of Files</Card.Header>
				{fileInfos ? (
					<ListGroup variant="flush">
						{fileInfos.map((file) => (
							<ListGroupItem key={file.id}>
								<a
									href={`${
										import.meta.env.SNOWPACK_PUBLIC_S3_URL
									}/${file.id}`}
									className="no-decorations"
								>
									{file.name}
								</a>
								&nbsp; &nbsp;
								<FaTrashAlt
									onClick={async () => {
										const maps = await MapsAPI.deleteMap(
											universe.id,
											file.id,
										);

										setFileInfos(maps);
									}}
								/>
							</ListGroupItem>
						))}
					</ListGroup>
				) : (
					<Spinner animation="border" />
				)}
			</Card>
		</Container>
	);
}
