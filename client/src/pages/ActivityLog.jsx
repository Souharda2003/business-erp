import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { getActivityLog } from "../services/activity";
import "../css/activity.css";

function ActivityLog() {
  const [logs, setLogs] = useState([]);

  const loadData = async () => {
    const res = await getActivityLog();

    setLogs(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="page">
      <BackButton />

      <h1 className="page-title">Activity Log</h1>

      <div className="activity-card">
        {logs.length === 0 ? (
          <div className="emptyActivity">No Activity Found</div>
        ) : (
          logs.map((item) => {
            const created = new Date(item.created_at);
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
        {created.toLocaleDateString("en-IN")}
    </div>

    <div>
        {created.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
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
