module.exports = {
    // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
    // This option interrupts the configuration hierarchy at this file
    // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
    root: true,

    parserOptions: {
        ecmaVersion: "2021" // Allows for the parsing of modern ECMAScript features
    },

    env: {
        node: true,
        browser: true,
        "vue/setup-compiler-macros": true
    },

    // Rules order is important, please avoid shuffling them
    extends: [
        // Base ESLint recommended rules
        "eslint:recommended",

        // Uncomment any of the lines below to choose desired strictness,
        // but leave only one uncommented!
        // See https://eslint.vuejs.org/rules/#available-rules
        // 'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
        // 'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
        "plugin:vue/vue3-recommended", // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

        "standard"
    ],

    plugins: [
        // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
        // required to lint *.vue files
        "vue"
    ],

    globals: {
        ga: "readonly", // Google Analytics
        cordova: "readonly",
        __statics: "readonly",
        __QUASAR_SSR__: "readonly",
        __QUASAR_SSR_SERVER__: "readonly",
        __QUASAR_SSR_CLIENT__: "readonly",
        __QUASAR_SSR_PWA__: "readonly",
        process: "readonly",
        Capacitor: "readonly",
        chrome: "readonly"
    },

    // add your custom rules here
    rules: {
        // allow async-await
        "generator-star-spacing": "off",
        // allow paren-less arrow functions
        "arrow-parens": "off",
        "one-var": "off",
        "no-void": "off",
        "multiline-ternary": ["error", "always-multiline"],

        "import/first": "off",
        "import/named": "error",
        "import/namespace": "error",
        "import/default": "error",
        "import/export": "error",
        "import/extensions": "off",
        "import/no-unresolved": "off",
        "import/no-extraneous-dependencies": "off",

        "prefer-promise-reject-errors": "off",

        // allow debugger during development only
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",

        // custom rules
        indent: ["error", 4, {
            offsetTernaryExpressions: true
        }],
        "max-len": ["error", { code: 120 }],
        semi: ["error", "always"],
        quotes: ["error", "double"],
        "comma-dangle": ["error", "never"],
        "space-before-function-paren": [
            "error",
            {
                anonymous: "always",
                named: "never",
                asyncArrow: "always"
            }
        ],
        "no-trailing-spaces": "error",

        // Don't to use a separate line for every attribute. It looks weird.
        "vue/max-attributes-per-line": 0,
        // some elements should not be forced to have newlines
        "vue/singleline-html-element-content-newline": [
            "error",
            {
                ignoreWhenEmpty: true,
                ignores: ["a", "div", "q-item-label"]
            }
        ]
    },
    // see: https://github.com/vuejs/eslint-plugin-vue/issues/1355#issuecomment-1011266670
    overrides: [
        {
          files: ["*.html"],
          processor: "vue/.vue"
        }
    ]
};
