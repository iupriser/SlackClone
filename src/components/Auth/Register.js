import React, { Component } from 'react';
import firebase from '../../firebase';
import md5 from 'md5';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users'),
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      // throws error
      error = { message: 'Fill in all the fields' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isUsernameValid(this.state)) {
      // throws error(invalid username)
      error = {
        message:
          'Invalid Username, Username should be greater than 4 character',
      };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      // throws error
      error = { message: 'Password is invalid' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      // form is valid
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isUsernameValid = ({ username }) => {
    if (username.length < 4) {
      return false;
    } else {
      return true;
    }
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 && passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  displayErrors = (error) =>
    error.map((error, i) => <p key={i}>{error.message}</p>);

  handleChange = (event) => {
    // computed property name [expression], expression is computed and used as property name
    /**
     * event.target
     * event === argument of an event handler, you attach to a certain event on a certain component
     * target === element that triggered the event
     * object destructuring === allows us to extract properties from an object, or items from an array
     */
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`,
            })
            .then(() => {
              // this.setState({ loading: false });
              this.saveUser(createdUser).then(() => {
                console.log('user saved');
              });
            })
            .catch((err) => {
              console.error(err);
              this.setState({
                errors: this.state.errors.concat(err),
                loading: false,
              });
            });
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          });
        });
    }
  };

  saveUser = (createdUser) => {
    return this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };

  handleInputError = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? 'error'
      : '';
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading,
    } = this.state;

    return (
      <Grid textAlign='center' verticalAlign='middle' className='app'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' icon color='orange' textAlign='center'>
            <Icon name='puzzle piece' color='orange' />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size='large'>
            <Segment stacked>
              <Form.Input
                fluid
                name='username'
                icon='user'
                iconPosition='left'
                placeholder='Username'
                onChange={this.handleChange}
                type='text'
                value={username}
                className={this.handleInputError(errors, 'username')}
              />
              <Form.Input
                fluid
                name='email'
                icon='mail'
                iconPosition='left'
                placeholder='Email Address'
                onChange={this.handleChange}
                type='email'
                value={email}
                className={this.handleInputError(errors, 'email')}
              />
              <Form.Input
                fluid
                name='password'
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                onChange={this.handleChange}
                type='password'
                value={password}
                className={this.handleInputError(errors, 'password')}
              />
              <Form.Input
                fluid
                name='passwordConfirmation'
                icon='repeat'
                iconPosition='left'
                placeholder='Password Confirmation'
                onChange={this.handleChange}
                type='password'
                value={passwordConfirmation}
                className={this.handleInputError(errors, 'password')}
              />

              <Button
                disabled={loading}
                className={loading ? 'loading' : ''}
                fluid
                color='orange'
                size='large'
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already a user? <Link to='/login'>Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
