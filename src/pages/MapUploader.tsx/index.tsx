import React, { useState, useEffect, ChangeEvent } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import MapsAPI from "../../utils/MapsAPI";
import { MapData } from "../../utils/MapsAPI";

export default function MapUploader() {
	return (
		<div>
			<UploadFiles></UploadFiles>
		</div>
	);
}

function UploadFiles() {
	const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
	const [progress, setProgress] = useState(0);
	const [message, setMessage] = useState("");
	const [fileInfos, setFileInfos] = useState<MapData[]>([]);

	useEffect(() => {
		MapsAPI.getMaps().then((r) => {
			setFileInfos(r);
		});
		return () => {};
	}, []);

	const upload = async () => {
		if (!selectedFiles) return;
		setProgress(0);

		try {
			const res = await MapsAPI.uploadMap(
				selectedFiles[0],
				"testMap.png",
				"jdr",
				(progress) =>
					setProgress(
						Math.round((100 * progress.loaded) / progress.total),
					),
			);

			console.log(res);

			setProgress(0);
			setMessage(res.message);
			setFileInfos(res.maps);
		} catch (error) {
			setProgress(0);
			setMessage("Could not upload the file ! " + error.message);
		}

		setSelectedFiles(null);
	};

	return (
		<div>
			{selectedFiles && selectedFiles[0] && (
				<div className="progress">
					<div
						className="progress-bar progress-bar-info progress-bar-striped"
						role="progressbar"
						aria-valuenow={progress}
						aria-valuemin={0}
						aria-valuemax={100}
						style={{ width: progress + "%" }}
					>
						{progress}%
					</div>
				</div>
			)}

			<label className="btn btn-default">
				<input
					type="file"
					onChange={(e) => setSelectedFiles(e.target.files)}
				/>
			</label>

			<button
				className="btn btn-success"
				disabled={!selectedFiles}
				onClick={upload}
			>
				Upload
			</button>

			<div className="alert alert-light" role="alert">
				{message}
			</div>

			<div className="card">
				<div className="card-header">List of Files</div>
				<ul className="list-group list-group-flush">
					{fileInfos ? (
						fileInfos.map((file, index) => (
							<li className="list-group-item" key={index}>
								<a href={file.url}>{file.name}</a>
							</li>
						))
					) : (
						<div className="spinner-border" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					)}
				</ul>
			</div>
		</div>
	);
}
