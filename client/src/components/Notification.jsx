import "../css/notification.css";

function Notification() {

    return (

        <div className="notification-box">

            <h2>

                Notifications

            </h2>

            <div className="notification-item">

                🔔 New Purchase Added

            </div>

            <div className="notification-item">

                📦 Low Stock Alert

            </div>

            <div className="notification-item">

                💰 Payment Received

            </div>

            <div className="notification-item">

                📄 GST Return Due

            </div>

        </div>

    );

}

export default Notification;