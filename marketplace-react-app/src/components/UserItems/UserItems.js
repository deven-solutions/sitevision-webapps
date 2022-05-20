import * as React from "react";
import router from "@sitevision/api/common/router";
import requester from "@sitevision/api/client/requester";
import i18n from "@sitevision/api/common/i18n";
import cloneDeep from "lodash/cloneDeep";

const UserItems = ({ updateUserItem, updateActiveTab }) => {
  const [items, setItems] = React.useState([]);

  const handleEdit = (item) => {
    updateUserItem(cloneDeep(item));
    updateActiveTab(2);
  };

  const handleRemove = (dsid) => {
    requester
      .doDelete({
        url: router.getStandaloneUrl(`/user-items/${dsid}`),
      })
      .then((response) => {
        if (response.error) {
          alert(response.error);
        } else {
          setItems(items.filter((item) => item.dsid !== dsid));
        }
      });
  };

  const handleRemoveAll = () => {
    requester
      .doDelete({
        url: router.getStandaloneUrl(`/user-items`),
      })
      .then((response) => {
        if (response.error) {
          alert(response.error);
        } else {
          setItems([]);
        }
      });
  };

  React.useEffect(() => {
    requester
      .doGet({
        url: router.getStandaloneUrl("/user-items"),
      })
      .then((items) => {
        setItems(items);
      });
  }, []);

  return (
    <>
      <ul className="env-list env-list-dividers--top">
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
                    <li className="env-list__item">
                      {item.contactInfo.phoneNumber}
                    </li>
                    <li className="env-list__item">{item.contactInfo.email}</li>
                  </ul>
                </footer>
                <footer className="env-comment__footer env-m-top--small">
                  <ul className="env-list env-list--horizontal env-list-dividers--left">
                    <li className="env-list__item">
                      <button
                        type="button"
                        className="env-button env-button--slim env-button--primary"
                        onClick={() => handleEdit(item)}
                      >
                        {i18n.get("edit")}
                      </button>
                    </li>
                    <li className="env-list__item">
                      <button
                        type="button"
                        className="env-button env-button--slim env-button--danger"
                        onClick={() => handleRemove(item.dsid)}
                      >
                        {i18n.get("remove")}
                      </button>
                    </li>
                  </ul>
                </footer>
              </div>
            </article>
          </li>
        ))}
      </ul>
      {items.length > 0 ? (
        <button
          type="button"
          className="env-button env-button env-button--danger"
          onClick={() => handleRemoveAll()}
        >
          {i18n.get("removeAll")}
        </button>
      ) : null}
    </>
  );
};

export default UserItems;
