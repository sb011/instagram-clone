import React from 'react'

const Toast = ({msg, handleShow, bgColor}) => {
    return (
        <div 
            className={`toast show position-fixed text-light ${bgColor}`}
            style={{top: '5px', right: '5px', minWidth: '200px', zIndex: 50}}
        >
            <div className={`toast-header text-light ${bgColor}`}>
                <strong className="text-light" style={{marginRight: 'auto'}}>{msg.title}</strong>
                <button className="btn-close btn-close-white text-light"
                data-dismiss="toast"
                onClick={handleShow}
                style={{outline: 'none', marginLeft: '0.5rem', marginBottom: '0.25rem'}}>
                </button>
            </div>
            <div className="toast-body">
                {msg.body}
            </div>
        </div>
    )
}

export default Toast