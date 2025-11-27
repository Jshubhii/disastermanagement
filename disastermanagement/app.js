
const { useState, useEffect, useRef } = React;

// Application data with Kedarnath information
const appData = {
  defaultMapCenter: [30.7346, 79.0669],
  defaultMapZoom: 13,
  alerts: [
    {
      id: 1,
      title: "Flash Flood Warning - Alaknanda River",
      description: "Heavy rainfall upstream causing rapid water level rise. Pilgrims and locals near riverbank should evacuate immediately.",
      location: "Alaknanda River Valley, Kedarnath",
      severity: "danger",
      timestamp: "2025-09-11T14:30:00Z"
    },
    {
      id: 2,
      title: "Landslide Risk Alert",
      description: "Unstable terrain detected near Chorabari Glacier area. Avoid trekking routes until further notice.",
      location: "Chorabari Glacier Trek Route",
      severity: "high",
      timestamp: "2025-09-11T13:45:00Z"
    },
    {
      id: 3,
      title: "Weather Advisory - Heavy Snow",
      description: "Unexpected snowfall predicted above 3500m altitude. Pilgrims should carry warm clothing and avoid night travel.",
      location: "Kedarnath Temple Area",
      severity: "caution",
      timestamp: "2025-09-11T12:00:00Z"
    },
    {
      id: 4,
      title: "Helicopter Service Disruption",
      description: "Low visibility conditions affecting helicopter operations to Kedarnath. Surface route recommended.",
      location: "Kedarnath Helipad",
      severity: "caution",
      timestamp: "2025-09-11T11:15:00Z"
    },
    {
      id: 5,
      title: "Avalanche Watch",
      description: "High avalanche risk in upper reaches. All mountaineering activities suspended in the affected zones.",
      location: "Kedarnath Peak Climbing Routes",
      severity: "high",
      timestamp: "2025-09-11T10:00:00Z"
    }
  ],
  hazardZones: [
    {
      id: 1,
      center: [30.7346, 79.0669],
      radius: 1500,
      type: "flood_risk",
      severity: "high",
      name: "Flash Flood Risk Area",
      description: "Alaknanda Valley - High risk of flash floods due to heavy rainfall upstream. Immediate evacuation recommended for areas near riverbank.",
      safetyTips: "Move to higher ground immediately. Avoid crossing rivers. Follow evacuation routes.",
      color: "#dc2626"
    },
    {
      id: 2,
      center: [30.7290, 79.0610],
      radius: 800,
      type: "landslide_zone",
      severity: "high",
      name: "High Risk Landslide Zone",
      description: "Chorabari Glacier Area - Unstable terrain with high probability of landslides. Trekking prohibited.",
      safetyTips: "Avoid all activities in this zone. Use alternative routes. Report ground movement.",
      color: "#ea580c"
    },
    {
      id: 3,
      center: [30.7400, 79.0720],
      radius: 1200,
      type: "avalanche_zone",
      severity: "medium",
      name: "Avalanche Danger Zone",
      description: "High Altitude Areas - Moderate to high avalanche risk above 3500m. Mountaineering suspended.",
      safetyTips: "Stay below 3500m elevation. Avoid steep slopes. Check with authorities.",
      color: "#f59e0b"
    }
  ],
  hospitals: [
    {
      id: 1,
      name: "Kedarnath Health Center",
      coordinates: [30.7346, 79.0669],
      contact: "+91-1364-233108"
    },
    {
      id: 2,
      name: "Gaurikund Primary Health Center",
      coordinates: [30.7167, 79.0500],
      contact: "+91-1364-233109"
    }
  ],
  shelters: [
    {
      id: 1,
      name: "Kedarnath Emergency Shelter",
      coordinates: [30.7340, 79.0665],
      capacity: 500
    },
    {
      id: 2,
      name: "Gaurikund Relief Camp",
      coordinates: [30.7160, 79.0495],
      capacity: 300
    }
  ],
  chatbotCommands: {
    help: {
      response:
        "🆘 **Aapda Mitra Help**\n\nCommands:\n• **sos** - Emergency assistance\n• **emergency** - Emergency contacts\n• **weather** - Weather alerts\n• **evacuation** - Evacuation routes\n• **medical** - Medical facilities\n\nEmergency: **108** or **1078**"
    },
    sos: {
      response:
        "🚨 **EMERGENCY ACTIVATED**\n\n**Immediate Help:**\n• Uttarakhand Emergency: **1078**\n• National Emergency: **108**\n• Police: **100**\n\nStay calm. Help is coming!"
    },
    emergency: {
      response:
        "📞 **Emergency Contacts**\n\n• Disaster Helpline: **1078**\n• Medical Emergency: **108** \n• Kedarnath Police: **+91-1364-233100**"
    },
    weather: {
      response:
        "🌦️ **Weather Alerts**\n\n• Flash Flood Warning - Alaknanda River\n• Heavy Snow Alert - Above 3500m\n• Avalanche Watch - High altitude\n\nAvoid night travel."
    },
    evacuation: {
      response:
        "🏃 **Evacuation Routes**\n\n• Kedarnath → Gaurikund → Sonprayag\n• Emergency Helipad: Temple Area\n\n**Shelters:**\n• Kedarnath Shelter (500 capacity)\n• Gaurikund Camp (300 capacity)"
    },
    medical: {
      response:
        "🏥 **Medical Facilities**\n\n• Kedarnath Health Center\n• Gaurikund PHC (14 km)\n• Rudraprayag Hospital (75 km)"
    }
  },
  incidentTypes: [
    "Landslide",
    "Flash Flood",
    "Avalanche",
    "Medical Emergency",
    "Missing Person",
    "Other"
  ],
  severityLevels: ["Low", "Medium", "High", "Critical"]
};

// Icon components
const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const AlertsIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const PlusIcon = ({ active }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ChatIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const UserIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ---------------- MAP VIEW (unchanged) ---------------- */

const MapView = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapboxgl.accessToken =
        "pk.eyJ1IjoianNodWJoaWkiLCJhIjoiY21pZnJiOWYxMDBiZDNjc2Rydmg3NHY1ayJ9.gdiQ_hSrrjMVMGHhqh1aNw";

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [appData.defaultMapCenter[1], appData.defaultMapCenter[0]],
        zoom: appData.defaultMapZoom - 1,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true,
        showAccuracyCircle: true
      });
      map.addControl(geolocateControl, "top-left");

      map.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 100,
          unit: "metric"
        }),
        "bottom-left"
      );

      map.on("load", () => {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14
        });
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 90.0],
            "sky-atmosphere-sun-intensity": 15
          }
        });
      });

      mapInstanceRef.current = map;

      // hazard zones, hospitals, shelters, user location...
      // (keep your existing implementation here exactly as it is)
      // TRUNCATED FOR BREVITY – use your existing MapView code.
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const centerOnUser = () => {
    if (userPosition && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [userPosition[1], userPosition[0]],
        zoom: 16
      });
    }
  };

  return (
    <div className="relative h-full w-full">
      <div
        ref={mapRef}
        className="map-container"
        style={{ height: "100%", width: "100%" }}
      ></div>

      <button
        onClick={centerOnUser}
        className="absolute top-4 right-4 z-[1000] bg-slate-800 hover:bg-slate-700 text-cyan-400 p-3 rounded-full center-location-btn"
        disabled={!userPosition}
      >
        <LocationIcon />
      </button>
    </div>
  );
};

/* ---------------- ALERTS LIST (unchanged) ---------------- */

const AlertsList = () => {
  const getSeverityClass = (severity) => {
    switch (severity) {
      case "danger":
        return "severity-danger";
      case "high":
        return "severity-high";
      case "caution":
        return "severity-caution";
      default:
        return "severity-caution";
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-200 mb-6">
          Active Alerts - Kedarnath
        </h2>

        {appData.alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-slate-800 rounded-lg p-4 border border-slate-600"
          >
            <div className="flex items-start space-x-3">
              <div
                className={`severity-dot ${getSeverityClass(
                  alert.severity
                )} mt-2`}
              ></div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-slate-200 mb-1">
                  {alert.title}
                </h3>
                <p className="text-slate-400 text-sm mb-2">
                  {alert.description}
                </p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{alert.location}</span>
                  <span>{formatTime(alert.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- REPORT INCIDENT (unchanged) ---------------- */

const ReportIncident = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    incidentType: "",
    severity: "",
    description: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      alert(
        "Incident reported successfully! Emergency services have been notified."
      );
      setShowModal(false);
      setIsSubmitting(false);
      setFormData({ incidentType: "", severity: "", description: "" });
    }, 1500);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ incidentType: "", severity: "", description: "" });
  };

  const updateFormData = (field) => (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: e.target.value
    }));
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      {/* ... keep your existing JSX here (omitted for brevity) */}
    </div>
  );
};

/* ---------------- CHATBOT (unchanged) ---------------- */

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content:
        "🙏 Namaste! I'm Aapda Mitra, your emergency assistant for Kedarnath region. Type **help** for commands."
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    const command = input.toLowerCase().trim();
    const response = appData.chatbotCommands[command] || {
      response: `I don't recognize "${input}". Type **help** to see available commands.`
    };

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: response.response }
      ]);
    }, 500);

    setInput("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* ... keep existing chatbot JSX (omitted for brevity) */}
    </div>
  );
};

/* ---------------- USER PROFILE (uses user from SignIn) ---------------- */

const UserProfile = ({ user, setUser }) => {
  const handleLogout = () => {
    setUser(null); // go back to sign-in
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4">
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4 border-2 border-cyan-400">
            <UserIcon />
          </div>
          <h2 className="text-xl font-bold text-slate-200">{user.name}</h2>
          <p className="text-slate-400">Registered Volunteer</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <h3 className="font-semibold text-slate-200 mb-3">
              Profile Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Age:</span>
                <span className="text-slate-200">{user.age}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Blood Group:</span>
                <span className="text-slate-200">{user.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Aadhaar:</span>
                <span className="text-slate-200">{user.aadhaar}</span>
              </div>
              {user.condition && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Condition:</span>
                  <span className="text-slate-200">{user.condition}</span>
                </div>
              )}
              {user.medicalHistory && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Medical History:</span>
                  <span className="text-slate-200 text-right">
                    {user.medicalHistory}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
            <h3 className="font-semibold text-slate-200 mb-3">
              Emergency Contacts
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Disaster Helpline:</span>
                <span className="text-slate-200">1078</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Medical Emergency:</span>
                <span className="text-slate-200">108</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Police:</span>
                <span className="text-slate-200">100</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- SIGN IN COMPONENT ---------------- */

const SignIn = ({ user, setUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bloodGroup: "",
    aadhaar: "",
    condition: "",
    medicalHistory: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.name || !formData.age || !formData.bloodGroup || !formData.aadhaar) {
    alert("Please fill in Name, Age, Blood Group and Aadhaar.");
    return;
  }

  try {
    const maskedAadhaar = formData.aadhaar.slice(-4);

    const docRef = await db.collection("users").add({
      name: formData.name,
      age: formData.age,
      bloodGroup: formData.bloodGroup,
      aadhaarLast4: maskedAadhaar,
      condition: formData.condition || "",
      medicalHistory: formData.medicalHistory || "",
      createdAt: new Date().toISOString()
    });

    setUser({
      ...formData,
      aadhaar: maskedAadhaar,
      id: docRef.id
    });
  } catch (err) {
    console.error(err);
    alert("Could not save data to Firestore.");
  }
};



  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Name*
          </label>
          <input
            className="form-control"
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="age">
            Age*
          </label>
          <input
            className="form-control"
            type="number"
            id="age"
            name="age"
            min="1"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="aadhaar">
            Aadhaar Number*
          </label>
          <input
            className="form-control"
            type="text"
            id="aadhaar"
            name="aadhaar"
            placeholder="Enter your Aadhaar number"
            value={formData.aadhaar}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="bloodGroup">
            Blood Group*
          </label>
          <select
            className="form-control"
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select your blood group
            </option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="condition">
            Condition
          </label>
          <input
            className="form-control"
            type="text"
            id="condition"
            name="condition"
            placeholder="Enter any medical condition"
            value={formData.condition}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="medicalHistory">
            Medical History <span className="optional">(optional)</span>
          </label>
          <textarea
            className="form-control"
            id="medicalHistory"
            name="medicalHistory"
            rows="3"
            placeholder="Enter medical history if any"
            value={formData.medicalHistory}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn--primary btn--full-width mt-4"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

/* ---------------- BOTTOM NAVIGATION ---------------- */

const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "home", icon: HomeIcon, label: "Home" },
    { id: "alerts", icon: AlertsIcon, label: "Alerts" },
    { id: "report", icon: PlusIcon, label: "Report", isCenter: true },
    { id: "chatbot", icon: ChatIcon, label: "Chat" },
    { id: "profile", icon: UserIcon, label: "Profile" }
  ];

  return (
    <div className="bottom-nav fixed bottom-0 left-0 right-0 h-20 flex items-center justify-around px-4 z-50">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;

        if (item.isCenter) {
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="report-button w-16 h-16 bg-cyan-400 hover:bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 transition-all duration-200"
            >
              <IconComponent active={isActive} />
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item flex flex-col items-center space-y-1 p-2 transition-colors ${
              isActive ? "text-cyan-400" : "text-slate-400"
            }`}
          >
            <IconComponent active={isActive} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

/* ---------------- MAIN APP ---------------- */

const App = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);

  if (!user) {
    return <SignIn user={user} setUser={setUser} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return <MapView key="home" />;
      case "alerts":
        return <AlertsList key="alerts" />;
      case "report":
        return <ReportIncident key="report" />;
      case "chatbot":
        return <ChatBot key="chatbot" />;
      case "profile":
        return <UserProfile key="profile" user={user} setUser={setUser} />;
      default:
        return <MapView key="default" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <main className="flex-1 pb-20 tab-content">{renderActiveTab()}</main>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

/* ---------------- RENDER ---------------- */

ReactDOM.render(<App />, document.getElementById("root"));
