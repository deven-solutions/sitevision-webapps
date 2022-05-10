import * as React from 'react'
import router from '@sitevision/api/common/router'
import requester from '@sitevision/api/client/requester'
import i18n from '@sitevision/api/common/i18n';

const UserItems = () => {

  const [items, setItems] = React.useState([])

  const handleRemove = (dsid) => {
    requester
      .doDelete({
        url: router.getStandaloneUrl(`/userItems/${dsid}`),
      })
      .then((response) => {
        if (response.error) {
          alert(response.error)
        } else {
          setItems(items.filter((item) => item.dsid !== dsid))
        }
      })
  }

  React.useEffect(() => {
    requester
      .doGet({
        url: router.getStandaloneUrl("/userItems"),
      })
      .then((items) => {
        setItems(items)
      })
  }, [])

  return (
    <>
      <ul className='env-list env-list-dividers--top'>
      {items.map((item) =>
        <li key={item.dsid} className="env-list__item env-p-around--large">
          <article className="env-comment env-media">
            <div className="env-media__figure" dangerouslySetInnerHTML={{__html: item.image}}></div>
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
                    {i18n.get('createdBy')} {item.contactInfo.name}
                  </li>
                  <li className="env-list__item">{item.contactInfo.phoneNumber}</li>
                  <li className="env-list__item">{item.contactInfo.email}</li>
                </ul>
              </footer>
              <footer className="env-comment__footer env-m-top--small">
                <ul className="env-list env-list--horizontal env-list-dividers--left">
                  <li className="env-list__item">
                    <a
                      className="env-button env-button--small env-button--primary"
                      href="<%= getUrl('/upload/' + dsid) %>"
                    >
                      {i18n.get('changeImage')}
                    </a>
                  </li>
                  <li className="env-list__item">
                    <a
                      className="env-button env-button--small env-button--primary"
                      href="<%= getUrl('/edit', {id:dsid}) %>"
                    >
                      {i18n.get('edit')}
                    </a>
                  </li>
                  <li className="env-list__item">
                    <button
                      type="button"
                      className="env-button env-button--small env-button--danger"
                      onClick={() => handleRemove(item.dsid)}
                    >
                      {i18n.get('remove')}
                    </button>
                    
                  </li>
                </ul>
              </footer>
            </div>
          </article>
        </li>
      
      )}
      </ul>
    </>
  )
}

export default UserItems;