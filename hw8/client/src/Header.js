import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import {Route, Switch} from "react-router-dom";


function Header() {
    return (
        <header>
            <Navbar bg="primary" variant="dark">
                {/*<Navbar.Brand href="#home">Navbar</Navbar.Brand>*/}
                <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-success">Search</Button>
                </Form>

                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/world">World</Nav.Link>
                    <Nav.Link href="/politics">Politics</Nav.Link>
                    <Nav.Link href="/business">Business</Nav.Link>
                    <Nav.Link href="/technology">Technology</Nav.Link>
                    <Nav.Link href="/sports">Sports</Nav.Link>
                </Nav>
            </Navbar>
            <br />
        </header>
    )
}

export default Header