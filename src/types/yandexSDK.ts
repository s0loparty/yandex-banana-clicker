/**
 * Интерфейс для объекта игрока (Player) согласно документации Яндекс Игр.
 */
export interface YandexPlayer {
	/**
	 * Сохраняет внутриигровые данные.
	 * @param data Объект с парами ключ-значение.
	 * @param flush Если true — данные отправляются сразу, иначе в очередь.
	 */
	setData: (data: Record<string, any>, flush?: boolean) => Promise<void>;

	/**
	 * Асинхронно получает внутриигровые данные.
	 * @param keys Массив ключей или undefined для получения всех данных.
	 */
	getData: (keys?: string[]) => Promise<Record<string, any>>;

	/**
	 * Сохраняет числовые данные игрока (статистика).
	 * @param stats Объект с числовыми значениями.
	 */
	setStats: (stats: Record<string, number>) => Promise<void>;

	/**
	 * Изменяет числовые данные игрока.
	 * @param increments Объект с числовыми инкрементами.
	 */
	incrementStats: (
		increments: Record<string, number>
	) => Promise<Record<string, number>>;

	/**
	 * Асинхронно получает числовые данные игрока.
	 * @param keys Массив ключей или undefined для получения всех данных.
	 */
	getStats: (keys?: string[]) => Promise<Record<string, number>>;

	/**
	 * Возвращает уникальный идентификатор пользователя.
	 */
	getUniqueID: () => string;

	/**
	 * Возвращает идентификаторы пользователя во всех играх разработчика.
	 */
	getIDsPerGame: () => Promise<Array<{ appID: number; userID: string }>>;

	/**
	 * Возвращает имя игрока.
	 */
	getName: () => string;

	/**
	 * Возвращает URL аватара игрока.
	 * @param size Требуемый размер: 'small', 'medium' или 'large'.
	 */
	getPhoto: (size: 'small' | 'medium' | 'large') => string;

	/**
	 * Возвращает статус платежной активности игрока.
	 */
	getPayingStatus: () => string;

	/**
	 * Возвращает режим авторизации: 'lite' если игрок не авторизован, иначе — другой режим.
	 */
	getMode: () => string;
}

/**
 * Интерфейс для основного SDK Яндекс Игр.
 */
export interface YandexGamesSDK {
	adv: {
		showFullscreenAdv: () => Promise<void>;
		showRewardedVideo: () => Promise<void>;
	};
	auth: {
		openAuthDialog: () => Promise<void>;
	};
	getStorage: () => {
		setItem: (key: string, value: string) => Promise<void>;
		getItem: (key: string) => Promise<string | null>;
	};
	/**
	 * Метод для получения объекта игрока.
	 * Параметры:
	 *  - scopes: если true, запрашивает имя и аватар.
	 *  - signed: если true, возвращает подпись для авторизации на сервере.
	 */
	getPlayer: (params?: { scopes?: boolean; signed?: boolean }) => Promise<YandexPlayer>;
	// Дополнительные свойства можно добавить по мере необходимости.
}
