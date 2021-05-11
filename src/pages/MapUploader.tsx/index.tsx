import React, { useState, useEffect, ChangeEvent } from "react";

import MapsAPI from "../../utils/MapsAPI";
import { MapData } from "../../utils/MapsAPI";
import {
	Alert,
	Button,
	Card,
	InputGroup,
	ListGroup,
	ListGroupItem,
	ProgressBar,
} from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";

import "./mapUploader.css";

export default function MapUploader() {
	return (
		<div>
			<UploadFiles></UploadFiles>
		</div>
	);
}

function UploadFiles() {
	const [currentFile, setCurrentFile] = useState<File | null>(null);
	const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
	const [progress, setProgress] = useState(0);
	const [message, setMessage] = useState("");
	const [fileInfos, setFileInfos] = useState<MapData[]>([]);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		MapsAPI.getMaps().then((r) => {
			setFileInfos(r);
		});
		return () => {};
	}, []);

	const upload = async () => {
		if (!currentFile) return;
		setProgress(0);
		setUploading(true);
		try {
			const res = await MapsAPI.uploadMap(
				currentFile,
				"testMap.png",
				"jdr",
				(progress) =>
					setProgress(
						Math.round((100 * progress.loaded) / progress.total),
					),
			);

			setMessage(res.message);
			setFileInfos(res.maps);
		} catch (error) {
			setMessage("Could not upload the file ! " + error.message);
		}

		setUploading(false);
		setSelectedFiles(null);
		setCurrentFile(null);
		setProgress(0);
	};

	return (
		<div>
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

			<InputGroup>
				<label className="btn btn-default">
					<input
						type="file"
						onChange={(e) => {
							setSelectedFiles(e.target.files);

							if (e.target.files)
								setCurrentFile(e.target.files[0] || null);
						}}
					/>
				</label>
				<InputGroup.Append>
					<button
						className="btn btn-success"
						disabled={!currentFile}
						onClick={upload}
					>
						Upload
					</button>
				</InputGroup.Append>
			</InputGroup>

			<Alert variant="light">{message}</Alert>

			<Card>
				<Card.Header>List of Files</Card.Header>
				{fileInfos ? (
					<ListGroup variant="flush">
						{fileInfos.map((file) => (
							<ListGroupItem key={file.name}>
								<a href={file.url} className="no-decorations">
									{file.name}
								</a>
								&nbsp; &nbsp;
								<FaTrashAlt
									onClick={async () => {
										const maps = await MapsAPI.deleteMap(
											file.name,
										);

										setFileInfos(maps);
									}}
								/>
							</ListGroupItem>
						))}
					</ListGroup>
				) : (
					<div className="spinner-border" role="status">
						<span className="sr-only">Loading...</span>
					</div>
				)}
			</Card>
		</div>
	);
}
