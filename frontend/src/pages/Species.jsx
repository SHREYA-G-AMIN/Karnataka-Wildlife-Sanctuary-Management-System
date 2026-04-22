import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";
import { API_BASE_URL } from "../config";

function Species() {
  const navigate = useNavigate();
  const [species, setSpecies] = useState([]);
  const [parks, setParks] = useState([]);
  const [park, setPark] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState(null);

  const extraSpecies = [
   
  ];

  const displayedSpecies = [
    ...species,
    ...extraSpecies.filter(
      (item) => !species.some((existing) => existing.species_name === item.species_name)
    ),
  ];

  // Static data for species details
  const speciesInfo = {
    'Tiger': {
      description: 'The tiger is the largest cat species, known for its striking orange coat with black stripes. It is a solitary hunter and an apex predator.',
      habitat: 'Forests of Karnataka, especially Bandipur and Nagarhole National Parks.',
      status: 'Endangered',
      funFact: 'Tigers have unique stripe patterns, like human fingerprints, no two are alike!'
    },
    'Elephant': {
      description: 'Elephants are the largest land animals, recognized by their long trunks and tusks. They are highly intelligent and social.',
      habitat: 'Forests and grasslands of Karnataka, commonly found in Bandipur and Nagarhole National Parks.',
      status: 'Endangered',
      funFact: 'Elephants can communicate using infrasound, sounds too low for humans to hear.'
    },
    'Leopard': {
      description: 'Leopards are agile big cats with spotted coats, known for their climbing ability and stealth.',
      habitat: 'Forests and hilly regions of Karnataka, including Western Ghats.',
      status: 'Vulnerable',
      funFact: 'Leopards can carry prey twice their weight up trees to keep it safe from other predators.'
    },
    'Sloth Bear': {
      description: 'Sloth bears are medium-sized bears with long, shaggy fur and a distinctive white V-shaped mark on their chest.',
      habitat: 'Dry forests and grasslands of Karnataka.',
      status: 'Vulnerable',
      funFact: 'Sloth bears have a unique way of eating ants and termites by sucking them up with their lips.'
    },
    'Spotted Deer': {
      description: 'Also known as chital, these deer have a spotted coat and are common in Indian forests.',
      habitat: 'Forests and grasslands of Karnataka national parks.',
      status: 'Least Concern',
      funFact: 'Spotted deer can jump up to 2 meters high!'
    },
    'Peacock': {
      description: 'Peacocks are large, colorful birds known for their iridescent tail feathers that they display in courtship.',
      habitat: 'Open forests and grasslands across Karnataka.',
      status: 'Least Concern',
      funFact: 'Only male peacocks have the colorful tail; females are called peahens and are more subdued.'
    },
    'Python': {
      description: 'Pythons are large, non-venomous snakes that kill their prey by constriction.',
      habitat: 'Forests and wetlands of Karnataka, especially in Western Ghats.',
      status: 'Not Evaluated',
      funFact: 'Pythons can swallow prey whole, including animals larger than their head!'
    },
    'Cobra': {
      description: 'Cobras are venomous snakes known for their hood and upright posture when threatened.',
      habitat: 'Forests and wetlands of Karnataka, especially in Western Ghats.',
      status: 'Not Evaluated',
      funFact: 'King cobras can grow up to 18 feet long and are the longest venomous snakes.'
    },
    'Langur': {
      description: 'Langurs are agile monkeys with long tails, known for their leaping ability.',
      habitat: 'Forests and temple regions across Karnataka.',
      status: 'Least Concern',
      funFact: 'Langurs can leap up to 4 meters between trees!'
    },
    'Wild Boar': {
      description: 'Wild boars are large, hairy pigs with tusks, known for their rooting behavior.',
      habitat: 'Forests and agricultural areas of Karnataka.',
      status: 'Least Concern',
      funFact: 'Wild boars can run up to 48 km/h!'
    },
    'Gaur': {
      description: 'Gaur are the largest wild cattle, with a muscular build and curved horns.',
      habitat: 'Western Ghats forests in Karnataka, especially in Nagarhole and Bandipur.',
      status: 'Vulnerable',
      funFact: 'Gaur are excellent swimmers and can cross rivers easily.'
    },
    'Sambar Deer': {
      description: 'Sambar deer are large deer with a shaggy coat and branched antlers in males.',
      habitat: 'Dense forests of Karnataka, often seen in national parks.',
      status: 'Vulnerable',
      funFact: 'Sambar deer have a loud, barking call that can be heard from far away.'
    },
    'King Cobra': {
      description: 'The king cobra is the world\'s longest venomous snake, known for its deadly bite.',
      habitat: 'Rainforests of Western Ghats in Karnataka.',
      status: 'Vulnerable',
      funFact: 'King cobras can "stand" up to 1/3 of their body length when threatened.'
    },
    'Malabar Hornbill': {
      description: 'Malabar hornbills are large birds with curved beaks and striking plumage.',
      habitat: 'Western Ghats forests of Karnataka.',
      status: 'Near Threatened',
      funFact: 'During breeding, the female seals herself in a tree hole, and the male feeds her through a small slit.'
    },
    'Dhole': {
      description: 'Dholes are wild dogs, also known as Asiatic wild dogs, with reddish fur and bushy tails.',
      habitat: 'Forests of Karnataka, especially in protected reserves like Bandipur.',
      status: 'Endangered',
      funFact: 'Dholes are highly social and hunt in packs, sometimes taking down prey larger than themselves.'
    }
  };

  const getSpeciesInfo = (name) => speciesInfo[name] || {
    description: 'Information not available',
    habitat: 'Information not available',
    status: 'Information not available',
    funFact: 'Information not available'
  };

  useEffect(() => {
    let isMounted = true;

    const fetchParks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/parks`);
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data?.success) {
          setParks(Array.isArray(data?.data) ? data.data : []);
        } else {
          setParks([]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.log("Parks request failed:", err);
        setParks([]);
      }
    };

    fetchParks();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchSpecies = async () => {
      setLoading(true);
      setError("");

      try {
        const url =
          park === "all"
            ? `${API_BASE_URL}/species`
            : `${API_BASE_URL}/species?sanctuary_id=${park}`;
        const res = await fetch(url);
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Invalid species response format");
        }

        const data = await res.json();
        if (!isMounted) return;

        if (res.ok && data?.success) {
          setSpecies(Array.isArray(data?.data) ? data.data : []);
        } else {
          setSpecies([]);
          setError(data?.message || "Failed to load species");
        }
      } catch (err) {
        if (!isMounted) return;
        console.log("Species request failed:", err);
        setSpecies([]);
        setError(err?.message || "Unable to connect to the server");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSpecies();

    return () => {
      isMounted = false;
    };
  }, [park]);

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2 className="logo">Wildlife</h2>

        <ul>
          <li onClick={() => navigate("/dashboard")}>Dashboard</li>
          <li className="active">Species</li>
          <li onClick={() => navigate("/animals")}>Animals</li>
          <li onClick={() => navigate("/officers")}>Officers</li>
          <li onClick={() => navigate("/health")}>Health</li>
          <li onClick={() => navigate("/poaching")}>Poaching</li>
          <li
            className="logout"
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("role");
              navigate("/login");
            }}
          >
            Logout
          </li>
        </ul>
      </div>

      <div className="main">
        <div className="navbar">
          <h2>Species</h2>

          <select
            value={park}
            onChange={(e) => setPark(e.target.value)}
            className="park-select"
          >
            <option value="all">All Parks</option>
            {parks.map((parkOption) => (
              <option key={parkOption?.id} value={parkOption?.id}>
                {parkOption?.name}
              </option>
            ))}
          </select>

          <div className="user">
            <div className="avatar">T</div>
            <span>Tourist</span>
          </div>
        </div>

        <div className="activity">
          <h2>Species Gallery</h2>

          {error ? (
            <div className="status-message error-message">{error}</div>
          ) : null}

          {!error && loading ? (
            <div className="status-message">Loading species...</div>
          ) : null}

          {!error && !loading && species.length === 0 ? (
            <div className="status-message">
              No species found for the selected park.
            </div>
          ) : null}

          {!error && !loading && displayedSpecies.length > 0 ? (
            <div className="species-grid">
              {displayedSpecies.map((item) => (
                <div key={item?.species_id} className="species-card" onClick={() => setSelectedSpecies(item)}>
                  <div className="species-image-wrapper">
                    <img
                      src={
                        item?.image_url ||
                        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={item?.species_name || "Species"}
                    />
                  </div>
                  <div className="species-content">
                    <h3>{item?.species_name || "Unknown"}</h3>
                    <p>{item?.category || "Unknown category"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {selectedSpecies && (
        <div className="modal-overlay" onClick={() => setSelectedSpecies(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedSpecies(null)}>❌</button>
            <h2>{selectedSpecies.species_name}</h2>
            <img
              src={selectedSpecies.image_url || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"}
              alt={selectedSpecies.species_name}
              className="modal-image"
            />
            <p><strong>Category:</strong> {selectedSpecies.category}</p>
            <p><strong>Description:</strong> {getSpeciesInfo(selectedSpecies.species_name).description}</p>
            <p><strong>Habitat:</strong> {getSpeciesInfo(selectedSpecies.species_name).habitat}</p>
            <p><strong>Conservation Status:</strong> {getSpeciesInfo(selectedSpecies.species_name).status}</p>
            <div className="fun-fact">
              <h3>Did You Know?</h3>
              <p>{getSpeciesInfo(selectedSpecies.species_name).funFact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Species;
