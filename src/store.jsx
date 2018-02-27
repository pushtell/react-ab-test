
class Store {
    constructor() {
        this.storeAvailable = false;
        try {
            if (typeof window !== 'undefined' && 'localStorage' in window && window['localStorage'] !== null) {
                let key = '__pushtell_react__';
                window.localStorage.setItem(key, key);
                if (window.localStorage.getItem(key) === key) {
                    window.localStorage.removeItem(key);
                    this.storeAvailable = true;
                }
            }
        } catch (e) {
        }
    }
    getItem(key) {
        if (this.storeAvailable) {
            return window.localStorage.getItem(key)
        }
    }
    setItem(key, value) {
        if (this.storeAvailable) {
            window.localStorage.setItem(key, value)

        }
    }
    clear() {
        if (this.storeAvailable) {
            window.localStorage.clear()
        }
    }

}

export default new Store();
