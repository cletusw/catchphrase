import {
  Hook,
  hook,
  useEffect,
  useState,
} from 'haunted';

export const useServerTimeOffset = hook(class extends Hook {
  constructor(id, state) {
    super(id, state);
  }

  update(database, initialValue) {
    const [serverTimeOffset, setServerTimeOffset] = useState(initialValue);

    useEffect(() => {
      const offsetRef = database.ref('.info/serverTimeOffset');
      offsetRef.on('value', function (snapshot) {
        setServerTimeOffset(snapshot.val());
      });
    }, []);

    return serverTimeOffset;
  }
});
