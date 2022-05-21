import * as React from "react";
import router from "@sitevision/api/common/router";
import requester from "@sitevision/api/client/requester";
import i18n from "@sitevision/api/common/i18n";

const Items = () => {
  const [items, setItems] = React.useState([]);

  const handleReportChange = (dsid, report) => {
    setItems(
      items.map((item) =>
        item.dsid === dsid ? { ...item, report: report } : item
      )
    );
  };

  const handleReport = (item) => {
    const subjectPart1 = i18n.get("mailSubjectPart1");
    const subjectPart2 = i18n.get("mailSubjectPart2");
    requester
      .doPost({
        url: router.getUrl("/report"),
        data: {
          subject: subjectPart1 + item.title + subjectPart2,
          text: item.report,
        },
      })
      .done((res) => {
        if (!res.mailSent) {
          // eslint-disable-next-line no-undef
          alert(i18n.get("mailNotSent"));
        }
      });
    handleReportChange(item.dsid, "");
  };

  React.useEffect(() => {
    requester
      .doGet({
        url: router.getStandaloneUrl("/items"),
      })
      .then((items) => {
        setItems(items);
      });
  }, []);

  return (
    <>
      <ul className="env-list">
        {items.map((item) => (
          <li key={item.dsid} className="env-list__item env-p-around--large">
            <article className="env-comment env-media">
              <div
                className="env-media__figure"
                dangerouslySetInnerHTML={{ __html: item.image }}
              ></div>
              <div className="env-media__body">
                <header className="env-comment__header">
                  <div className={item.titleClass}>{item.title}</div>
                </header>
                <p className="env-text">{item.description}</p>
                <footer className="env-comment__footer">
                  <ul className="env-list env-list--horizontal env-list-dividers--left">
                    <li className="env-list__item">
                      <strong>{item.price} kr</strong>
                    </li>
                    <li className="env-list__item">
                      {i18n.get("createdBy")} {item.contactInfo.name}
                    </li>
                  </ul>
                </footer>
                <footer className="env-comment__footer env-m-top--small">
                  <ul className="env-list env-list--horizontal env-list-dividers--left">
                    <li className="env-list__item">
                      <a
                        className="env-button env-button--slim"
                        href={"tel:" + item.contactInfo.phoneNumber}
                      >
                        <svg className="env-icon env-icon--small env-align--middle">
                          <use xlinkHref="/sitevision/envision-icons.svg#icon-phone"></use>
                        </svg>
                        <span className="env-m-left--x-small">
                          {" "}
                          {i18n.get("call")}{" "}
                        </span>
                      </a>
                    </li>
                    <li className="env-list__item">
                      <a
                        className="env-button env-button--slim"
                        href={
                          "mailto:" +
                          item.contactInfo.email +
                          "?subject" +
                          item.title
                        }
                      >
                        <svg className="env-icon env-icon--small env-align--middle">
                          <use xlinkHref="/sitevision/envision-icons.svg#icon-chat"></use>
                        </svg>
                        <span className="env-m-left--x-small">
                          {" "}
                          {i18n.get("sendEmail")}{" "}
                        </span>
                      </a>
                    </li>
                    <li className="env-list__item">
                      <button
                        data-modal-dialog
                        data-target={"#report-modal-" + item.dsid}
                        type="button"
                        className="env-button env-button--slim"
                      >
                        {i18n.get("report")}
                      </button>
                    </li>
                  </ul>
                </footer>
              </div>
            </article>
            <div
              id={"report-modal-" + item.dsid}
              className="env-modal-dialog"
              role="dialog"
              aria-labelledby="reportDialog"
              aria-hidden="true"
              tabIndex="-1"
            >
              <div className="env-modal-dialog__dialog">
                <section className="env-modal-dialog__content">
                  <header className="env-modal-dialog__header">
                    <h1 className="env-text env-modal-dialog__header__title">
                      {i18n.get("reportItem")}
                    </h1>
                  </header>
                  <div className="env-modal-dialog__body">
                    <p className="env-text">
                      <textarea
                        id={"report-modal-text-" + item.dsid}
                        name="reportText"
                        placeholder={i18n.get("reportItemText")}
                        rows="4"
                        cols="50"
                        value={item.report}
                        onChange={(e) =>
                          handleReportChange(item.dsid, e.target.value)
                        }
                      ></textarea>
                    </p>
                  </div>
                  <footer className="env-modal-dialog__footer env-modal-dialog__footer--right">
                    <button
                      id={"report-modal-btn-" + item.dsid}
                      type="button"
                      data-modal-dialog-dismiss
                      className="env-button env-button--primary"
                      onClick={() => handleReport(item)}
                    >
                      {i18n.get("send")}
                    </button>
                    <button
                      type="button"
                      data-modal-dialog-dismiss
                      className="env-button env-button--link"
                    >
                      {i18n.get("cancel")}
                    </button>
                  </footer>
                </section>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Items;
