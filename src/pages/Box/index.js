import React, { Component } from "react";
import logo from "../../assets/logo.svg";
import "./styles.css";
import api from "../../services/api";
import Dropzone from "react-dropzone";
import { MdInsertDriveFile } from "react-icons/md";
import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";
import socket from "socket.io-client";

export default class Box extends Component {
  state = { box: {} };

  async componentDidMount() {
    this.subscribeToNewFiles();

    const boxId = this.props.match.params.id;
    const response = await api.get(`/boxes/${boxId}`);

    this.setState({ box: response.data });
  }

  subscribeToNewFiles = () => {
    const boxId = this.props.match.params.id;
    const io = socket("https://rocketbox-api.herokuapp.com/api");

    io.emit("connectRoom", boxId);

    io.on("file", data => {
      this.setState({
        box: { ...this.state.box, file: [data, ...this.state.box.files] }
      });
    });
  };

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      const boxId = this.props.match.params.id;

      data.append("file", file);

      api.post(`/boxes/${boxId}/files`, data);
    });
  };

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="logo" />
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Arraste arquivos ou solte aqui...</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a
                  className="fileInfo"
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdInsertDriveFile size={24} color="#A5Cfff" />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  há{" "}
                  {distanceInWords(file.createdAt, new Date(), { locale: pt })}{" "}
                  atrás
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
