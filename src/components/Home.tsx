import '../index';

const Home = () => {
    return (
        <div className="home-bg">
            <div className="home-container">
                <div className="logo-container">
                    <img src="/images/logo.gif" alt="logo" className='logo-size' />
                </div>
                <div className="content-container">
                    <div className='charcter-container'>
                        <form action="">
                            <input type="Enter your name" />
                            <div className='character-box'></div>
                        </form>
                    </div>
                            <button className='play-btn'>Play</button>
                            <button className='private-room-btn'>Create a Private Room</button>
                </div>
            </div>
        </div>
    )
}

export default Home;