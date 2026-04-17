import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Navbar from './components/Navbar'
import { Container, Row, Col, Button } from 'react-bootstrap'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Container className="py-5">
        <Row className="justify-content-center text-center">
          <Col md={8} lg={6}>
            <div className="hero mb-4">
              <img src={heroImg} className="base" width="170" height="179" alt="" />
              <img src={reactLogo} className="framework" alt="React logo" />
              <img src={viteLogo} className="vite" alt="Vite logo" />
            </div>
            <h1 className="display-4 mb-3">Get started</h1>
            <p className="lead mb-4">
              Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setCount((count) => count + 1)}
              className="mb-4"
            >
              Count is {count}
            </Button>
          </Col>
        </Row>
      </Container>

      <hr className="my-5" />

      <Container className="py-5">
        <Row>
          <Col md={6} className="mb-4 mb-md-0">
            <div className="text-center text-md-start">
              <svg className="icon mb-3" role="presentation" aria-hidden="true">
                <use href="/icons.svg#documentation-icon"></use>
              </svg>
              <h2 className="h3 mb-3">Documentation</h2>
              <p className="mb-4">Your questions, answered</p>
              <ul className="list-unstyled d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                <li>
                  <a href="https://vite.dev/" target="_blank" className="btn btn-outline-primary d-flex align-items-center gap-2">
                    <img className="logo" src={viteLogo} alt="" />
                    Explore Vite
                  </a>
                </li>
                <li>
                  <a href="https://react.dev/" target="_blank" className="btn btn-outline-primary d-flex align-items-center gap-2">
                    <img className="button-icon" src={reactLogo} alt="" />
                    Learn more
                  </a>
                </li>
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div className="text-center text-md-start">
              <svg className="icon mb-3" role="presentation" aria-hidden="true">
                <use href="/icons.svg#social-icon"></use>
              </svg>
              <h2 className="h3 mb-3">Connect with us</h2>
              <p className="mb-4">Join the Vite community</p>
              <ul className="list-unstyled d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                <li>
                  <a href="https://github.com/vitejs/vite" target="_blank" className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <svg
                      className="button-icon"
                      role="presentation"
                      aria-hidden="true"
                    >
                      <use href="/icons.svg#github-icon"></use>
                    </svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://chat.vite.dev/" target="_blank" className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <svg
                      className="button-icon"
                      role="presentation"
                      aria-hidden="true"
                    >
                      <use href="/icons.svg#discord-icon"></use>
                    </svg>
                    Discord
                  </a>
                </li>
                <li>
                  <a href="https://x.com/vite_js" target="_blank" className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <svg
                      className="button-icon"
                      role="presentation"
                      aria-hidden="true"
                    >
                      <use href="/icons.svg#x-icon"></use>
                    </svg>
                    X.com
                  </a>
                </li>
                <li>
                  <a href="https://bsky.app/profile/vite.dev" target="_blank" className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <svg
                      className="button-icon"
                      role="presentation"
                      aria-hidden="true"
                    >
                      <use href="/icons.svg#bluesky-icon"></use>
                    </svg>
                    Bluesky
                  </a>
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>

      <hr className="my-5" />
      <div style={{ height: '88px' }}></div>
    </>
  )
}

export default App
