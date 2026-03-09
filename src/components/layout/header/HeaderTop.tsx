import Link from 'next/link'
import React from 'react'
import { Row } from 'react-bootstrap'

const HeaderTop = () => {
    return (
        <div className="top-header" style={{
            background: 'linear-gradient(169deg, rgb(112 207 245) 20%, rgb(142 198 65) 100%)'
        }}>
            <div className="container">
                <Row>
                    <div className='col-12'>
                        <div className="inner-top-header">
                            <div className="col-left-bar">
                                {/*<Link href="/shop-left-sidebar-col-3">Flat 50% Off On Grocery Shop.</Link>*/}
                            </div>
                            <div className="col-right-bar">
                                <div className="cols text-white">
                                    <i className="ri-phone-line"></i> 01844545500
                                </div>
                                <div className="cols">
                                    <Link href="/track-order">Track Order</Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </Row>
            </div>
        </div>
    )
}

export default HeaderTop
