import * as React from 'react'
import router from '@sitevision/api/common/router'
import requester from '@sitevision/api/client/requester'
import i18n from '@sitevision/api/common/i18n';

const CreateItem = ({userItem, updateUserItem, updateActiveTab}) => {

  const form = React.useRef(null)
  const [imageRequired, setImageRequired] = React.useState(false)

  const isNewItem = () => userItem.dsid === undefined

  const handleSubmit = e => {
    e.preventDefault()
    const data = {
      url: router.getStandaloneUrl("/user-items" + (isNewItem() ? "" : "/" + userItem.dsid)),
      data: new FormData(form.current),
      fileUpload: true
    }
    let promise
    if (isNewItem()) {
      promise = requester.doPost(data)
    } else {
      promise = requester.doPut(data)
    }
    promise.then((response) => {
      if (response.error) {
        alert(response.error)
      } else {
        form.current.reset()
        updateUserItem({})
        updateActiveTab(1)
      }
    })
  };

  React.useEffect(() => {
    if (isNewItem()) {
      setImageRequired(true)
      requester
        .doGet({
          url: router.getStandaloneUrl("/contact-info"),
        })
        .then((contactInfo) => {
          updateUserItem({name: contactInfo.name, phoneNumber: contactInfo.phoneNumber, email: contactInfo.email})
        })
    } else {
      setImageRequired(false)
      updateUserItem({...userItem, name: userItem.contactInfo.name, phoneNumber: userItem.contactInfo.phoneNumber, email: userItem.contactInfo.email})
    }
  }, [])

  return (
    <>
      <form
        ref={form} onSubmit={handleSubmit}
        className="env-form env-w--50 env-p-left--large"
        encType="multipart/form-data"
      >
        <div className="env-form-element env-m-top--large">
          <label htmlFor="file" className="env-form-element__label"
            >{i18n.get('image')}
          </label>
          <div className="env-form-element__control">
            <input id="file" type="file" name="file" accept="image/*" required={imageRequired}/>
          </div>
        </div>
        <div className="env-form-element">
          <label htmlFor="title" className="env-form-element__label">
            {i18n.get('title')}
          </label>
          <div className="env-form-element__control">
            <input
              autoComplete="off"
              type="text"
              value={userItem.title}
              onChange={(e) => updateUserItem({...userItem, title: e.target.value})}
              className="env-form-input"
              placeholder={i18n.get('enter') + ' ' + i18n.get('title').toLowerCase()}
              name="title"
              id="title"
              required
            />
          </div>
        </div>
        <div className="env-form-element">
          <div className="env-form-element__control">
            <label htmlFor="description" className="env-form-element__label">
              {i18n.get('description')}
            </label>
            <input
              autoComplete="off"
              type="text"
              value={userItem.description}
              onChange={(e) => updateUserItem({...userItem, description: e.target.value})}
              placeholder={i18n.get('enter') + ' ' + i18n.get('description').toLowerCase()}
              className="env-form-input"
              name="description"
              id="description"
              required
            />
          </div>
        </div>
        <div className="env-form-element">
          <div className="env-form-element__control">
            <label htmlFor="price" className="env-form-element__label">
              {i18n.get('price')}
            </label>
            <input
              autoComplete="off"
              type="number"
              value={userItem.price}
              onChange={(e) => updateUserItem({...userItem, price: e.target.value})}
              placeholder={i18n.get('enter') + ' ' + i18n.get('price').toLowerCase()}
              className="env-form-input"
              name="price"
              id="price"
              required
            />
          </div>
        </div>
        <div className="env-form-element">
          <div className="env-form-element__control">
            <label htmlFor="name" className="env-form-element__label">
              {i18n.get('name')}
            </label>
            <input
              autoComplete="off"
              type="text"
              value={userItem.name}
              onChange={(e) => updateUserItem({...userItem, name: e.target.value})}
              placeholder={i18n.get('enter') + ' ' + i18n.get('name').toLowerCase()}
              className="env-form-input"
              name="name"
              id="name"
              required
            />
          </div>
        </div>
        <div className="env-form-element">
          <div className="env-form-element__control">
            <label htmlFor="phoneNumber" className="env-form-element__label">
              {i18n.get('phoneNumber')}
            </label>
            <input
              autoComplete="off"
              type="number"
              value={userItem.phoneNumber}
              onChange={(e) => updateUserItem({...userItem, phoneNumber: e.target.value})}
              placeholder={i18n.get('enter') + ' ' + i18n.get('phoneNumber').toLowerCase()}
              className="env-form-input"
              name="phoneNumber"
              id="phoneNumber"
              required
            />
          </div>
        </div>
        <div className="env-form-element">
          <div className="env-form-element__control">
            <label htmlFor="email" className="env-form-element__label">
              {i18n.get('email')}
            </label>
            <input
              autoComplete="off"
              type="email"
              value={userItem.email}
              onChange={(e) => updateUserItem({...userItem, email: e.target.value})}
              placeholder={i18n.get('enter') + ' ' + i18n.get('email').toLowerCase()}
              className="env-form-input"
              name="email"
              id="email"
              required
            />
          </div>
        </div>
        <div className="env-form-element">
          <input
            className="env-button env-button--primary"
            type="submit"
            value={i18n.get('save')}
          />
        </div>
      </form>
    </>
  )
}

export default CreateItem;
