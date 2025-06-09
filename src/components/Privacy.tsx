import '../index.css';

const Privacy = () => {
    return (
        <div className="conduct-container">
            <div>
                <h1 className="conduct-header">🔐 Privacy Policy </h1>
                <h2 className="conduct-title">1. What We Collect</h2>
            </div>

            <ul className="conduct-list">
                <li>Your username or nickname</li>

                <li>Words you submit for the word bank</li>

                <li>Drawings you create during gameplay</li>

                <li>Game session activity (for scoring and moderation)</li>
            </ul>

            <div>
                <h2 className="conduct-title">2. What We Don’t Collect</h2>
                <ul className="conduct-list">
                    <li>We don’t collect real names, email addresses, or payment info.</li>

                    <li>We don’t track your location.</li>
                </ul>
            </div>

            <div>
                <h2 className="conduct-title">3. How We Use Your Info</h2>
                <ul className="conduct-list">
                    <li>To run each game session fairly</li>

                    <li>To prevent abuse and moderate offensive content</li>

                    <li>To improve the game experience over time</li>
                </ul>
            </div>

            <div>
                <h2 className="conduct-title">4. Data Retention</h2>
                <ul className="conduct-list">
                    <li>Game content (drawings and words) may be stored temporarily, but not permanently unless needed for moderation or game history features.</li>
                </ul>
            </div>
        </div>
    );
}

export default Privacy;