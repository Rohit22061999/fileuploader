import { Button, Form, ModalBody } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import FileDownload from "js-file-download";
import "./App.css";

function App() {
  const [file, setFile] = useState();
  const [filename, setFilename] = useState();

  useEffect(() => {
    axios.get("http://localhost:8000/getFile").then((response) => {
      setFilename(response.data.files);
      console.log(response.data);
    });
  }, []);

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const url = "http://localhost:8000/uploadFile";
    let formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    axios
      .post(url, formData, {
        headers: { "content-type": "multipart/form-data" },
      })
      .then((response) => {
        axios.get("http://localhost:8000/getFile").then((response) => {
          setFilename(response.data.files);
        });
      });
  }

  const handleDownload = async (n) => {
    console.log(n);
    axios({
      url: "http://localhost:8000/downloadFile",
      method: "POST",
      responseType: "blob",
      data: { file: n },
    }).then((res) => {
      console.log(res.data);
      FileDownload(res.data, n);
    });
  };

  return (
    <div>
      <div>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Control
            type="file"
            placeholder="upload here"
            onChange={handleChange}
            name="file"
          />
          <Button className="my-2" variant="primary" type="submit">
            upload file
          </Button>
        </Form>
      </div>

      <div>
        <ul>
          {console.log(filename)}
          {filename &&
            filename?.map((n, index) => {
              return (
                <>
                  <div>
                    <li key={index}>{n}</li>

                    <Button
                      className="my-2"
                      variant="primary"
                      onClick={() => handleDownload(n)}
                    >
                      download
                    </Button>
                  </div>
                </>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

export default App;
