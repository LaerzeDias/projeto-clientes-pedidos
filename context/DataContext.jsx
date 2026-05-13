import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substr(2, 9);

const DataContext = createContext(null);

const KEYS = {
  clientes: "@gestao:clientes",
  pedidos: "@gestao:pedidos",
  anotacoes: "@gestao:anotacoes",
};

export function DataProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [anotacoes, setAnotacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [c, p, a] = await Promise.all([
          AsyncStorage.getItem(KEYS.clientes),
          AsyncStorage.getItem(KEYS.pedidos),
          AsyncStorage.getItem(KEYS.anotacoes),
        ]);
        if (c) setClientes(JSON.parse(c));
        if (p) setPedidos(JSON.parse(p));
        if (a) setAnotacoes(JSON.parse(a));
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveClientes = useCallback(async (data) => {
    setClientes(data);
    await AsyncStorage.setItem(KEYS.clientes, JSON.stringify(data));
  }, []);

  const savePedidos = useCallback(async (data) => {
    setPedidos(data);
    await AsyncStorage.setItem(KEYS.pedidos, JSON.stringify(data));
  }, []);

  const saveAnotacoes = useCallback(async (data) => {
    setAnotacoes(data);
    await AsyncStorage.setItem(KEYS.anotacoes, JSON.stringify(data));
  }, []);

  const addCliente = useCallback(
    async (data) => {
      const novo = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      await saveClientes([...clientes, novo]);
    },
    [clientes, saveClientes]
  );

  const updateCliente = useCallback(
    async (id, data) => {
      await saveClientes(
        clientes.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
    },
    [clientes, saveClientes]
  );

  const deleteCliente = useCallback(
    async (id) => {
      await saveClientes(clientes.filter((c) => c.id !== id));
      await savePedidos(pedidos.filter((p) => p.clienteId !== id));
    },
    [clientes, pedidos, saveClientes, savePedidos]
  );

  const addPedido = useCallback(
    async (data) => {
      const novo = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      await savePedidos([...pedidos, novo]);
    },
    [pedidos, savePedidos]
  );

  const updatePedido = useCallback(
    async (id, data) => {
      await savePedidos(
        pedidos.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
    },
    [pedidos, savePedidos]
  );

  const deletePedido = useCallback(
    async (id) => {
      await savePedidos(pedidos.filter((p) => p.id !== id));
    },
    [pedidos, savePedidos]
  );

  const addAnotacao = useCallback(
    async (data) => {
      const now = new Date().toISOString();
      const nova = { ...data, id: generateId(), createdAt: now, updatedAt: now };
      await saveAnotacoes([...anotacoes, nova]);
    },
    [anotacoes, saveAnotacoes]
  );

  const updateAnotacao = useCallback(
    async (
      id,
      data
    ) => {
      await saveAnotacoes(
        anotacoes.map((a) =>
          a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
        )
      );
    },
    [anotacoes, saveAnotacoes]
  );

  const deleteAnotacao = useCallback(
    async (id) => {
      await saveAnotacoes(anotacoes.filter((a) => a.id !== id));
    },
    [anotacoes, saveAnotacoes]
  );

  return (
    <DataContext.Provider
      value={{
        clientes,
        pedidos,
        anotacoes,
        loading,
        addCliente,
        updateCliente,
        deleteCliente,
        addPedido,
        updatePedido,
        deletePedido,
        addAnotacao,
        updateAnotacao,
        deleteAnotacao,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData deve ser usado dentro de DataProvider");
  return ctx;
}
