"use strict"

document.addEventListener('DOMContentLoaded', () => {
  hideLoader()
  showHeader()
  countersAnimation()
  vacancyNumbers()
  formValidation()
  activeHeaderLinks()
  linksLogic()
  scrollToTop()
  mobileNav()
  resumePopupLogic()
})

function hideLoader() {
  const loader = document.querySelector('.loader')
  if (loader) setTimeout(() => loader.classList.add('loaded'), 0)
}

function showHeader() {
  const header = document.querySelector('.header')
  if (header) {
    let lastScroll = 0
    window.addEventListener('scroll', () => {
      if (window.outerWidth > 991) {
        if (window.pageYOffset < lastScroll) {
          header.classList.add('scroll-up')
          header.classList.remove('scroll-down')
        } else {
          header.classList.remove('scroll-up')
          header.classList.add('scroll-down')
        }
        lastScroll = window.pageYOffset
      }
    })
    if (window.outerWidth < 992) header.classList.add('fixed')
    window.addEventListener('resize', () => {
      if (window.outerWidth > 991) {
        header.classList.remove('fixed')
        header.classList.add('scroll-up')
      } else {
        header.classList.remove('scroll-up', 'scroll-down')
        header.classList.add('fixed')
      }
    })
  }
}

function countersAnimation() {
  const countersSecttion = document.querySelector('#counters')
  if (countersSecttion) {
    const counterItems = [...countersSecttion.querySelectorAll('.counter-item')]
    let scrolled = false
    window.addEventListener('scroll', () => {
      if (window.pageYOffset + window.innerHeight / 1.5 > countersSecttion.offsetTop && window.pageYOffset < countersSecttion.offsetTop && !scrolled) {
        counterItems.map(item => {
          const number = item.querySelector('.number-wrapper span')
          let from = 0
          const to = number.getAttribute('data-number')
          const step = to > from ? 1 : -1
          const interval = to > 50 ? 10 : 90
          if (from == to) {
            number.innerText = from
            return
          }
          const count = setInterval(function() {
            from += step
            number.innerText = from
            if (from == to) clearInterval(count)
          }, interval)
        })
        scrolled = true
      }
    })
  }
}

function vacancyNumbers() {
  const vacancies = [...document.querySelectorAll('#vacancies .content-item')]
  if (vacancies) {
    vacancies.map((item, index) => {
      const numberBlock = item.querySelector('.content-item__number')
      const number = index + 1
      number < 10 ? numberBlock.innerText = '0' + number : numberBlock.innerText = number
    })
  }
}

function formValidation() {
  const formSection = document.querySelector('#contact')
  if (formSection) {
    const form = formSection.querySelector('form')
    const inputWrappers = [...form.querySelectorAll('.input-wrapper')]
    form.addEventListener('submit', e => {
      let inputsWithError = []
      e.preventDefault()
      inputWrappers.map(wrap => {
        const input = wrap.querySelector('input, textarea')
        input.value === '' ? wrap.classList.add('error') : wrap.classList.remove('error')
        inputsWithError.push([...wrap.classList].some(hasError => hasError === 'error'))
      })
      const findError = inputsWithError.some(error => error === true)
      if (!findError) form.submit()
    })
    inputWrappers.map(wrap => {
      const input = wrap.querySelector('input, textarea')
      input.addEventListener('blur', () => {
        input.value === '' ? wrap.classList.add('error') : wrap.classList.remove('error')
      })
    })
  }
}

function activeHeaderLinks() {
  const headerNav = [...document.querySelectorAll('header .navigation li')]
  const sections = [...document.querySelectorAll('section')]
  if (headerNav && sections) {
    window.addEventListener('scroll', () => {
      let current = ''
      sections.map(section => {
        if (window.pageYOffset >= section.offsetTop) current = section.getAttribute('id')
      })
      headerNav.map(li => {
        const link = li.querySelector('a')
        li.classList.remove('active')
        if (link.getAttribute('href').replace('#','') === current) li.classList.add('active')
      })
    })
  }
}

function linksLogic() {
  const allLinks = [...document.querySelectorAll('a')]
  if (allLinks) {
    allLinks.map(link => {
      if (link.hasAttribute('href')) {
        const loader = document.querySelector('.loader')
        const firstSymbol = link.getAttribute('href').charAt(0)
        link.addEventListener('click', e => {
          e.preventDefault()
          if (firstSymbol === '#') {
            const href = link.getAttribute('href')
            const offsetTop = document.querySelector(href).offsetTop
            scroll({
              top: offsetTop,
              behavior: 'smooth'
            })
          } else if (!link.parentElement.classList.contains('active')) {
            loader.classList.remove('loaded')
            setTimeout(() => location.href = link.getAttribute('href'), 400)
          }
        })
      }
    })
  }
}

function scrollToTop() {
  const scrollButton = document.querySelector('.scroll-to-top')
  if (scrollButton) {
    window.addEventListener('scroll', () => {
      if (window.outerWidth > 991) window.pageYOffset > 500 ? scrollButton.classList.add('show') : scrollButton.classList.remove('show')
    })
    window.addEventListener('resize', () => {
      if (window.outerWidth < 992) {
        scrollButton.classList.remove('show')
      } else if (window.pageYOffset > 500) {
        scrollButton.classList.add('show')
      }
    })
    scrollButton.addEventListener('click', () => {
      scroll({
        top: 0,
        behavior: 'smooth'
      })
    })
  }
}

function mobileNav() {
  const hamburger = document.querySelector('.hamburger')
  const nav = document.querySelector('nav')
  if (hamburger && nav) {
    const links = [...nav.querySelectorAll('.navigation a')]
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active')
      nav.classList.add('transition')
      nav.classList.toggle('show')
    })
    window.addEventListener('resize', () => nav.classList.remove('transition'))
    links.map(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          hamburger.classList.remove('active')
          nav.classList.remove('show')
        }
      })
    })
  }
}

const showPopup = message => {
  const $el = `<div class="popup-window"><div class="popup">${message}</div></div>`
  document.querySelector('body').insertAdjacentHTML('afterbegin', $el)
  setTimeout(() => {
    document.querySelector('body').removeChild(document.querySelector('.popup-window'))
  }, 3000)
}

const sendPost = async (url, method = 'GET', body = null, headers = {}) => {
  try {
    const response = await fetch(url, {method, body, headers})
    if (!response.ok) {
      return {
        message: response.status === 413 ? 'Sorry, your file is too large.' : response.statusText,
        httpstatus: response.status
      }
    }
    return await response.json()
  } catch (e) {
    console.warn(e)
  }
}

function resumePopupLogic() {
  const resumePopup = document.querySelector('#resumePopup')
  if (resumePopup) {
    const openPopupButtons = [...document.querySelectorAll('.open-resume-popup')]
    const backdrop = resumePopup.querySelector('.backdrop')
    const resumeForm = resumePopup.querySelector('form')
    const resumeInputWrappers = [...resumeForm.querySelectorAll('.input-wrapper')]
    const customButton = resumeForm.querySelector('.file-button')
    const realButton = resumeForm.querySelector('#resumeFile')
    const fileInput = resumeForm.querySelector('.file-input')
    const textField = fileInput.querySelector('.file-text')
    openPopupButtons.map(btn => btn.addEventListener('click', () => resumePopup.classList.add('show')))
    backdrop.addEventListener('click', () => resumePopup.classList.remove('show'))
    document.addEventListener('keydown', e => e.key === 'Escape' ? resumePopup.classList.remove('show') : '')
    customButton.addEventListener('click', () => realButton.click())
    textField.addEventListener('click', () => realButton.click())
    realButton.addEventListener('change', ({target}) => {
      let file = target.files[0]
      if (file) {
        let fileName = file.name
        textField.style.color = '#000'
        fileInput.classList.remove('error')
        if (fileName.length >= 20) {
          let splitName = fileName.split('.')
          fileName = splitName[0].substring(0, 20) + '... .' + splitName[1]
        }
        textField.innerText = fileName
      }
    })
    resumeForm.addEventListener('submit', e => {
      let inputsWithError = []
      e.preventDefault()
      resumeInputWrappers.map(wrap => {
        const input = wrap.querySelector('input')
        input.value === '' ? wrap.classList.add('error') : wrap.classList.remove('error')
        inputsWithError.push([...wrap.classList].some(hasError => hasError === 'error'))
      })
      const findError = inputsWithError.some(error => error === true)
      if (!findError) {
        const formData = new FormData()
        formData.append('Full Name', `${resumeForm.querySelector('#resumeName').value} ${resumeForm.querySelector('#resumeLastName').value}`)
        formData.append('Email', resumeForm.querySelector('#resumeEmail').value)
        formData.append('Position', resumeForm.querySelector('#resumePosition').value)
        if (resumeForm.querySelector('input[type="file"]').files[0]) {
          formData.append('attached_file', resumeForm.querySelector('input[type="file"]').files[0])
        }
        formData.append('Subject', `Response to "${resumeForm.querySelector('#resumePosition').value}" position`)
        sendPost('/api.php', 'POST', formData).then(response => {
          if ('result' in response && response.result.email_id) {
            resumeForm.reset()
            resumePopup.classList.remove('show')
            showPopup('Message sended')
            return
          }
          resumePopup.classList.remove('show')
          showPopup('Message not send. Try again')
        })
      }
    })
    resumeInputWrappers.map(wrap => {
      const input = wrap.querySelector('input')
      input.addEventListener('blur', () => input.value === '' ? wrap.classList.add('error') : wrap.classList.remove('error'))
    })
  }
}