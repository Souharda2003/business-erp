import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { getActivityLog } from "../services/activity";
import "../css/activity.css";

function ActivityLog() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    const res = await getActivityLog();

    setLogs(res.data);
  };

  return (
    <div className="page">
<div className="lc-header">
  <BackButton />

  <div>
    <h1 className="page-title">
      Activity Log
    </h1>
  </div>
</div>
      <div className="activity-card">
        {logs.length === 0 ? (
          <div className="emptyActivity">No Activity Found</div>
        ) : (
          logs.map(item => {
    console.log(item.created_at);
    console.log(item.timezone);

const date = new Date(item.created_at.replace(" ", "T") + "Z");
            const icon =
              item.action === "ADD"
                ? "🟢"
                : item.action === "UPDATE"
                  ? "🟠"
                  : item.action === "DELETE"
                    ? "🔴"
                    : item.action === "LOGIN"
                      ? "🔵"
                      : item.action === "PROFILE"
                        ? "👤"
                        : item.action === "BACKUP"
                          ? "💾"
                          : item.action === "FINANCIAL YEAR"
                            ? "📅"
                            : "📋";

            return (
              <div key={item.id} className="activity-row">
                <div className="activity-left">
                  <div className="activity-icon">{icon}</div>

                  <div>
                    <div className="activity-user">{item.user_name}</div>

                    <div className="activity-action">{item.action}</div>

                    <div className="activity-description">
                      {item.description}
                    </div>

                    <div className="activity-badge">{item.module_name}</div>
                  </div>
                </div>

<div className="activity-time">
<div>
  {date.toLocaleDateString("en-IN", {
    timeZone: item.timezone || "Asia/Kolkata"
  })}
</div>

<div>
  {date.toLocaleTimeString("en-IN", {
    timeZone: item.timezone || "Asia/Kolkata"
  })}
</div>
</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ActivityLog;
