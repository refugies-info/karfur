import React from "react";

const commentaires = (props) => {
  return (
    <>
      <hr />
      <div className="card my-4">
        <h5 className="card-header">Laisser un commentaire :</h5>
        <div className="card-body">
          <form>
            <div className="form-group">
              <textarea className="form-control" rows="3"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Soumettre
            </button>
          </form>
        </div>
      </div>
      <div className="media mb-4">
        <img
          className="d-flex mr-3 rounded-circle"
          src="http://placehold.it/50x50"
          alt=""
        />
        <div className="media-body">
          <h5 className="mt-0">Alfred</h5>
          J'aime beaucoup ce conte.
        </div>
      </div>
      <div className="media mb-4">
        <img
          className="d-flex mr-3 rounded-circle"
          src="http://placehold.it/50x50"
          alt=""
        />
        <div className="media-body">
          <h5 className="mt-0">Sarah</h5>
          This is an amazing story. I hope I can read more of these. Thanks a
          lot for the sharing.
          <div className="media mt-4">
            <img
              className="d-flex mr-3 rounded-circle"
              src="http://placehold.it/50x50"
              alt=""
            />
            <div className="media-body">
              <h5 className="mt-0">Ahmed</h5>
              Ma fhemt 7ta 7aja fhad lnoukta. Chkoun l7ellouf ou chkoun ldi2ab.
            </div>
          </div>
          <div className="media mt-4">
            <img
              className="d-flex mr-3 rounded-circle"
              src="http://placehold.it/50x50"
              alt=""
            />
            <div className="media-body">
              <h5 className="mt-0">Soufiane</h5>
              Merci pour vos commentaires. J'essaierai d'adapter une nouvelle
              histoire rapidement
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default commentaires;
