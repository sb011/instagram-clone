import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { register } from '../redux/actions/authAction';


const Register = () => {
    const { auth, alert } = useSelector(state => state);
    const history = useHistory();

    const initialState = {
        fullname: '',
        username: '',
        email: '',
        password: '',
        cf_password: '',
        gender: 'male',
    };
    const [userData, setUserData] = useState(initialState);
    const { fullname, username, email, password, cf_password } = userData;

    const [typePass, setTypePass] = useState(false);
    const [typeCfPass, setTypeCfPass] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if(auth.token)
            history.push('/')
    }, [auth.token, history]);

    const handleChangeInput = e => {
        const {name, value} = e.target;
        setUserData({...userData, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(userData));
    }

    return (
        <div className="auth_page">
            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">Insta</h3>
                <div className="mb-3">
                    <label htmlFor="fullname" className="form-label">Full Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="fullname" 
                        onChange={handleChangeInput} 
                        value={fullname} 
                        name="fullname" 
                        style={{background: `${alert.fullname ? '#fd2d6a14' : ''}`}}
                    />
                    <div className="form-text text-danger">
                        {alert.fullname ? alert.fullname : ''}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="username" className="form-label">User Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="username" 
                        onChange={handleChangeInput} 
                        value={username.toLowerCase().replace(/ /g, '')} 
                        name="username"
                        style={{background: `${alert.username ? '#fd2d6a14' : ''}`}}    
                    />
                    <div className="form-text text-danger">
                        {alert.username ? alert.username : ''}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="exampleInputEmail1" 
                        onChange={handleChangeInput} 
                        value={email} 
                        name="email"
                        style={{background: `${alert.email ? '#fd2d6a14' : ''}`}}  
                    />
                    <div className="form-text text-danger">
                        {alert.email ? alert.email : ''}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <div className="pass">
                        <input 
                            type={typePass? "text" : "password"} 
                            className="form-control" 
                            id="exampleInputPassword1" 
                            onChange={handleChangeInput} 
                            value={password} 
                            name="password"
                            style={{background: `${alert.password ? '#fd2d6a14' : ''}`}}
                        />
                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass? 'Hide' : 'Show'}
                        </small>
                    </div>
                    <div className="form-text text-danger">
                        {alert.password ? alert.password : ''}
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="exampleInputPassword2" className="form-label">Confirm Password</label>
                    <div className="pass">
                        <input 
                            type={typeCfPass? "text" : "password"} 
                            className="form-control" 
                            id="exampleInputPassword2" 
                            onChange={handleChangeInput} 
                            value={cf_password} 
                            name="cf_password"
                            style={{background: `${alert.cf_password ? '#fd2d6a14' : ''}`}}
                        />
                        <small onClick={() => setTypeCfPass(!typeCfPass)}>
                            {typeCfPass? 'Hide' : 'Show'}
                        </small>
                    </div>
                    <div className="form-text text-danger">
                        {alert.cf_password ? alert.cf_password : ''}
                    </div>
                </div>

                <div className="row justify-content-between mx-0 mb-1">
                    <label htmlFor="male">
                        Male: <input type="radio" id="male" name="gender" value="male" defaultChecked onChange={handleChangeInput} />
                    </label>
                    <label htmlFor="female">
                        Female: <input type="radio" id="female" name="gender" value="female" onChange={handleChangeInput} />
                    </label>
                    <label htmlFor="other">
                        Other: <input type="radio" id="other" name="gender" value="other" onChange={handleChangeInput} />
                    </label>
                </div>

                <button type="submit" className="btn btn-dark w-100" >Register</button>

                <p className="my-2">
                    Already have an account? <Link to="/" style={{color: "crimson"}}>Login</Link>
                </p>
            </form>
        </div>
    )
}

export default Register;