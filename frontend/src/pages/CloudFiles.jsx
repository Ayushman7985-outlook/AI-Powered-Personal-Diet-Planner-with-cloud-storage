import {
  ArrowLeft,
  Cloud,
  Download,
  FileText,
  Trash2,
  Upload
} from "lucide-react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState
} from "react";


const API_URL = "http://localhost:5000";


function CloudFiles() {

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [deleting, setDeleting] =
    useState("");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  useEffect(() => {

    loadFiles();

  }, []);


  async function loadFiles() {

    const token =
      localStorage.getItem("access_token");

    if (!token) {

      navigate("/login");

      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/api/files`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Unable to load cloud files."
        );
      }


      setFiles(
        data.files || []
      );


    } catch (error) {

      setError(
        error.message
      );


    } finally {

      setLoading(false);

    }
  }


  function handleFileChange(event) {

    const file =
      event.target.files?.[0];


    setSelectedFile(
      file || null
    );

    setError("");

    setMessage("");
  }


  async function uploadFile() {

    const token =
      localStorage.getItem("access_token");


    if (!token) {

      navigate("/login");

      return;
    }


    if (!selectedFile) {

      setError(
        "Please select a file first."
      );

      return;
    }


    setUploading(true);

    setError("");

    setMessage("");


    try {

      const formData =
        new FormData();


      formData.append(
        "file",
        selectedFile
      );


      const response =
        await fetch(
          `${API_URL}/api/upload`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: formData
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "File upload failed."
        );
      }


      setMessage(
        "File uploaded successfully."
      );


      setSelectedFile(null);


      if (fileInputRef.current) {

        fileInputRef.current.value =
          "";

      }


      await loadFiles();


    } catch (error) {

      setError(
        error.message
      );


    } finally {

      setUploading(false);

    }
  }


  async function deleteFile(fileId) {

    const token =
      localStorage.getItem("access_token");


    if (!token) {

      navigate("/login");

      return;
    }


    if (
      !window.confirm(
        "Are you sure you want to delete this file?"
      )
    ) {

      return;

    }


    setDeleting(fileId);

    setError("");

    setMessage("");


    try {

      const response =
        await fetch(
          `${API_URL}/api/files/${fileId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Unable to delete file."
        );
      }


      setFiles(
        currentFiles =>
          currentFiles.filter(
            file =>
              file.file_id !== fileId
          )
      );


      setMessage(
        "File deleted successfully."
      );


    } catch (error) {

      setError(
        error.message
      );


    } finally {

      setDeleting("");

    }
  }


  function getFileExtension(filename) {

    if (
      !filename ||
      !filename.includes(".")
    ) {

      return "FILE";
    }


    return filename
      .split(".")
      .pop()
      .toUpperCase();
  }


  function formatDate(dateString) {

    if (!dateString) {

      return "Date unavailable";
    }


    return new Date(
      dateString
    ).toLocaleString();
  }


  if (loading) {

    return (
      <div className="dashboard-loading">

        <div className="loading-spinner"></div>

        <h2>
          Loading cloud files...
        </h2>

        <p>
          Fetching your files from
          Supabase Storage.
        </p>

      </div>
    );
  }


  return (
    <div className="dashboard-page">

      <main className="dashboard-main cloud-files-page">

        <Link
          to="/dashboard"
          className="auth-back"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </Link>


        <header className="dashboard-header cloud-files-header">

          <div>

            <p className="dashboard-overline">
              CLOUD STORAGE
            </p>

            <h1>
              Your cloud files
            </h1>

            <p>
              Upload and manage your personal
              files securely using cloud storage.
            </p>

          </div>

        </header>


        {error && (

          <div className="auth-error cloud-message">
            {error}
          </div>

        )}


        {message && (

          <div className="profile-success cloud-message">
            {message}
          </div>

        )}


        <section className="dashboard-panel cloud-upload-panel">

          <div className="cloud-upload-heading">

            <div className="cloud-upload-icon">

              <Cloud size={23} />

            </div>


            <div>

              <p className="panel-label">
                SECURE UPLOAD
              </p>

              <h2>
                Add a file to your cloud storage
              </h2>

              <p>
                Select a file from your computer
                and upload it to your private
                NutriAI storage.
              </p>

            </div>

          </div>


          <div className="cloud-upload-controls">

            <label className="file-picker">

              <FileText size={18} />

              <span>
                {selectedFile
                  ? selectedFile.name
                  : "Choose a file"}
              </span>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
              />

            </label>


            <button
              type="button"
              className="btn btn-primary"
              onClick={uploadFile}
              disabled={
                uploading ||
                !selectedFile
              }
            >

              <Upload size={17} />

              {uploading
                ? "Uploading..."
                : "Upload file"}

            </button>

          </div>

        </section>


        <section className="cloud-files-section">

          <div className="cloud-files-section-heading">

            <div>

              <p className="panel-label">
                YOUR FILES
              </p>

              <h2>
                Stored in the cloud
              </h2>

            </div>


            <span className="cloud-file-count">

              {files.length}{" "}

              {files.length === 1
                ? "file"
                : "files"}

            </span>

          </div>


          {files.length === 0 ? (

            <div className="dashboard-panel empty-state cloud-empty-state">

              <div className="cloud-empty-icon">

                <Cloud size={30} />

              </div>

              <h2>
                No files uploaded yet
              </h2>

              <p>
                Upload your first file using
                the section above.
              </p>

            </div>

          ) : (

            <div className="cloud-files-grid">

              {files.map(file => (

                <article
                  className="dashboard-panel cloud-file-card"
                  key={file.file_id}
                >

                  <div className="cloud-file-top">

                    <div className="cloud-file-icon">

                      <FileText size={22} />

                    </div>


                    <span className="cloud-file-type">

                      {getFileExtension(
                        file.filename
                      )}

                    </span>

                  </div>


                  <h3
                    className="cloud-file-name"
                    title={file.filename}
                  >
                    {file.filename}
                  </h3>


                  <p className="cloud-file-date">

                    Uploaded{" "}

                    {formatDate(
                      file.uploaded_at
                    )}

                  </p>


                  <div className="cloud-file-actions">

                    {file.signed_url && (

                      <a
                        href={file.signed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline cloud-view-button"
                      >

                        <Download size={16} />

                        Open

                      </a>

                    )}


                    <button
                      type="button"
                      className="icon-button danger"
                      onClick={() =>
                        deleteFile(
                          file.file_id
                        )
                      }
                      disabled={
                        deleting ===
                        file.file_id
                      }
                      title="Delete file"
                    >

                      <Trash2 size={17} />

                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>


        <section className="cloud-storage-note">

          <Cloud size={18} />

          <div>

            <strong>
              Private cloud storage
            </strong>

            <p>
              Files are stored in the private
              <strong> diet-files </strong>
              Supabase Storage bucket.
              Access is controlled by the
              authenticated application.
            </p>

          </div>

        </section>


        <p className="result-disclaimer">

          NutriAI stores uploaded files for
          educational project purposes.
          Do not upload sensitive medical
          or confidential documents.

        </p>

      </main>

    </div>
  );
}


export default CloudFiles;