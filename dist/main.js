
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        if (component.$$.props.indexOf(name) === -1)
            return;
        component.$$.bound[name] = callback;
        callback(component.$$.ctx[name]);
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src\Button.svelte generated by Svelte v3.12.1 */

    const file = "src\\Button.svelte";

    function create_fragment(ctx) {
    	var button, dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Open";
    			attr_dev(button, "class", "color space border-none bg-teal-500 hover:bg-teal-400 rounded svelte-3gymvv");
    			add_location(button, file, 7, 0, 172);
    			dispose = listen_dev(button, "click", ctx.open);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { open } = $$props;

    	const writable_props = ['open'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    	};

    	$$self.$capture_state = () => {
    		return { open };
    	};

    	$$self.$inject_state = $$props => {
    		if ('open' in $$props) $$invalidate('open', open = $$props.open);
    	};

    	return { open };
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, ["open"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Button", options, id: create_fragment.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.open === undefined && !('open' in props)) {
    			console.warn("<Button> was created without expected prop 'open'");
    		}
    	}

    	get open() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\GithubButton.svelte generated by Svelte v3.12.1 */

    const file$1 = "src\\GithubButton.svelte";

    function create_fragment$1(ctx) {
    	var a, svg, title, t0, path, t1, span, t2;

    	const block = {
    		c: function create() {
    			a = element("a");
    			svg = svg_element("svg");
    			title = svg_element("title");
    			t0 = text("GitHub icon");
    			path = svg_element("path");
    			t1 = space();
    			span = element("span");
    			t2 = text(ctx.caption);
    			add_location(title, file$1, 5, 109, 393);
    			attr_dev(path, "d", "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12");
    			add_location(path, file$1, 5, 135, 419);
    			attr_dev(svg, "class", "fill-current w-4 h-4 mr-2");
    			attr_dev(svg, "role", "img");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$1, 5, 4, 288);
    			add_location(span, file$1, 6, 4, 1155);
    			attr_dev(a, "class", "content-center bg-gray-400 hover:bg-teal-300 text-gray-100 rounded-full font-bold py-8 px-4 inline-flex items-center");
    			attr_dev(a, "href", ctx.url);
    			attr_dev(a, "target", "_blank");
    			set_style(a, "color", "black");
    			set_style(a, "text-decoration", "none");
    			set_style(a, "margin-left", "25vw");
    			add_location(a, file$1, 4, 0, 67);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, svg);
    			append_dev(svg, title);
    			append_dev(title, t0);
    			append_dev(svg, path);
    			append_dev(a, t1);
    			append_dev(a, span);
    			append_dev(span, t2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.caption) {
    				set_data_dev(t2, ctx.caption);
    			}

    			if (changed.url) {
    				attr_dev(a, "href", ctx.url);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(a);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { caption, url } = $$props;

    	const writable_props = ['caption', 'url'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<GithubButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('caption' in $$props) $$invalidate('caption', caption = $$props.caption);
    		if ('url' in $$props) $$invalidate('url', url = $$props.url);
    	};

    	$$self.$capture_state = () => {
    		return { caption, url };
    	};

    	$$self.$inject_state = $$props => {
    		if ('caption' in $$props) $$invalidate('caption', caption = $$props.caption);
    		if ('url' in $$props) $$invalidate('url', url = $$props.url);
    	};

    	return { caption, url };
    }

    class GithubButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["caption", "url"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "GithubButton", options, id: create_fragment$1.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.caption === undefined && !('caption' in props)) {
    			console.warn("<GithubButton> was created without expected prop 'caption'");
    		}
    		if (ctx.url === undefined && !('url' in props)) {
    			console.warn("<GithubButton> was created without expected prop 'url'");
    		}
    	}

    	get caption() {
    		throw new Error("<GithubButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set caption(value) {
    		throw new Error("<GithubButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<GithubButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<GithubButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Phone.svelte generated by Svelte v3.12.1 */

    const file$2 = "src\\Phone.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.ddi = list[i];
    	return child_ctx;
    }

    // (226:8) {#each ddiList as ddi}
    function create_each_block(ctx) {
    	var option, t_value = ctx.ddi.nmCountry + "", t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = ctx.ddi.cdCountry;
    			option.value = option.__value;
    			add_location(option, file$2, 226, 12, 16716);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(option);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(226:8) {#each ddiList as ddi}", ctx });
    	return block;
    }

    function create_fragment$2(ctx) {
    	var select, option, t_1, input, dispose;

    	let each_value = ctx.ddiList;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			option = element("option");
    			option.textContent = "DDI";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t_1 = space();
    			input = element("input");
    			option.__value = "";
    			option.value = option.__value;
    			option.selected = true;
    			add_location(option, file$2, 224, 8, 16632);
    			if (ctx.ddi === void 0) add_render_callback(() => ctx.select_change_handler.call(select));
    			attr_dev(select, "class", "form-select  inline w-1/6");
    			add_location(select, file$2, 223, 5, 16562);
    			attr_dev(input, "class", "form-input mt-1 w-1000 ");
    			attr_dev(input, "id", "tel");
    			attr_dev(input, "type", "tel");
    			attr_dev(input, "placeholder", "Phone");
    			attr_dev(input, "size", "9");
    			add_location(input, file$2, 231, 0, 16808);

    			dispose = [
    				listen_dev(select, "change", ctx.select_change_handler),
    				listen_dev(input, "input", ctx.input_input_handler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, ctx.ddi);

    			insert_dev(target, t_1, anchor);
    			insert_dev(target, input, anchor);

    			set_input_value(input, ctx.phone);
    		},

    		p: function update(changed, ctx) {
    			if (changed.ddiList) {
    				each_value = ctx.ddiList;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if (changed.ddi) select_option(select, ctx.ddi);
    			if (changed.phone) set_input_value(input, ctx.phone);
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(select);
    			}

    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(t_1);
    				detach_dev(input);
    			}

    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { ddi='', phone='' } = $$props;
        let ddiList = [
            {"cdCountry":"55","nmCountry":"Brazil (+55)","isoCountry":""}
            ,{"cdCountry":"64","nmCountry":"New Zealand (+64)","isoCountry":""}
            ,{"cdCountry":"61","nmCountry":"Australia (+61)","isoCountry":""}
            ,{"cdCountry":"1","nmCountry":"USA (+1)","isoCountry":""}
            ,{"cdCountry":"44","nmCountry":"UK (+44)","isoCountry":""}
            ,{"cdCountry":"213","nmCountry":"Algeria (+213)","isoCountry":""}
            ,{"cdCountry":"376","nmCountry":"Andorra (+376)","isoCountry":""}
            ,{"cdCountry":"244","nmCountry":"Angola (+244)","isoCountry":""}
            ,{"cdCountry":"1264","nmCountry":"Anguilla (+1264)","isoCountry":""}
            ,{"cdCountry":"1268","nmCountry":"Antigua &amp; Barbuda (+1268)","isoCountry":""}
            ,{"cdCountry":"54","nmCountry":"Argentina (+54)","isoCountry":""}
            ,{"cdCountry":"374","nmCountry":"Armenia (+374)","isoCountry":""}
            ,{"cdCountry":"297","nmCountry":"Aruba (+297)","isoCountry":""}
            ,{"cdCountry":"43","nmCountry":"Austria (+43)","isoCountry":""}
            ,{"cdCountry":"994","nmCountry":"Azerbaijan (+994)","isoCountry":""}
            ,{"cdCountry":"1242","nmCountry":"Bahamas (+1242)","isoCountry":""}
            ,{"cdCountry":"973","nmCountry":"Bahrain (+973)","isoCountry":""}
            ,{"cdCountry":"880","nmCountry":"Bangladesh (+880)","isoCountry":""}
            ,{"cdCountry":"1246","nmCountry":"Barbados (+1246)","isoCountry":""}
            ,{"cdCountry":"375","nmCountry":"Belarus (+375)","isoCountry":""}
            ,{"cdCountry":"32","nmCountry":"Belgium (+32)","isoCountry":""}
            ,{"cdCountry":"501","nmCountry":"Belize (+501)","isoCountry":""}
            ,{"cdCountry":"229","nmCountry":"Benin (+229)","isoCountry":""}
            ,{"cdCountry":"1441","nmCountry":"Bermuda (+1441)","isoCountry":""}
            ,{"cdCountry":"975","nmCountry":"Bhutan (+975)","isoCountry":""}
            ,{"cdCountry":"591","nmCountry":"Bolivia (+591)","isoCountry":""}
            ,{"cdCountry":"387","nmCountry":"Bosnia Herzegovina (+387)","isoCountry":""}
            ,{"cdCountry":"267","nmCountry":"Botswana (+267)","isoCountry":""}
            ,{"cdCountry":"673","nmCountry":"Brunei (+673)","isoCountry":""}
            ,{"cdCountry":"359","nmCountry":"Bulgaria (+359)","isoCountry":""}
            ,{"cdCountry":"226","nmCountry":"Burkina Faso (+226)","isoCountry":""}
            ,{"cdCountry":"257","nmCountry":"Burundi (+257)","isoCountry":""}
            ,{"cdCountry":"855","nmCountry":"Cambodia (+855)","isoCountry":""}
            ,{"cdCountry":"237","nmCountry":"Cameroon (+237)","isoCountry":""}
            ,{"cdCountry":"1","nmCountry":"Canada (+1)","isoCountry":""}
            ,{"cdCountry":"238","nmCountry":"Cape Verde Islands (+238)","isoCountry":""}
            ,{"cdCountry":"1345","nmCountry":"Cayman Islands (+1345)","isoCountry":""}
            ,{"cdCountry":"236","nmCountry":"Central African Republic (+236)","isoCountry":""}
            ,{"cdCountry":"56","nmCountry":"Chile (+56)","isoCountry":""}
            ,{"cdCountry":"86","nmCountry":"China (+86)","isoCountry":""}
            ,{"cdCountry":"57","nmCountry":"Colombia (+57)","isoCountry":""}
            ,{"cdCountry":"269","nmCountry":"Comoros (+269)","isoCountry":""}
            ,{"cdCountry":"242","nmCountry":"Congo (+242)","isoCountry":""}
            ,{"cdCountry":"682","nmCountry":"Cook Islands (+682)","isoCountry":""}
            ,{"cdCountry":"506","nmCountry":"Costa Rica (+506)","isoCountry":""}
            ,{"cdCountry":"385","nmCountry":"Croatia (+385)","isoCountry":""}
            ,{"cdCountry":"53","nmCountry":"Cuba (+53)","isoCountry":""}
            ,{"cdCountry":"90","nmCountry":"Cyprus - North (+90)","isoCountry":""}
            ,{"cdCountry":"357","nmCountry":"Cyprus - South (+357)","isoCountry":""}
            ,{"cdCountry":"420","nmCountry":"Czech Republic (+420)","isoCountry":""}
            ,{"cdCountry":"45","nmCountry":"Denmark (+45)","isoCountry":""}
            ,{"cdCountry":"253","nmCountry":"Djibouti (+253)","isoCountry":""}
            ,{"cdCountry":"1809","nmCountry":"Dominica (+1809)","isoCountry":""}
            ,{"cdCountry":"1809","nmCountry":"Dominican Republic (+1809)","isoCountry":""}
            ,{"cdCountry":"593","nmCountry":"Ecuador (+593)","isoCountry":""}
            ,{"cdCountry":"20","nmCountry":"Egypt (+20)","isoCountry":""}
            ,{"cdCountry":"503","nmCountry":"El Salvador (+503)","isoCountry":""}
            ,{"cdCountry":"240","nmCountry":"Equatorial Guinea (+240)","isoCountry":""}
            ,{"cdCountry":"291","nmCountry":"Eritrea (+291)","isoCountry":""}
            ,{"cdCountry":"372","nmCountry":"Estonia (+372)","isoCountry":""}
            ,{"cdCountry":"251","nmCountry":"Ethiopia (+251)","isoCountry":""}
            ,{"cdCountry":"500","nmCountry":"Falkland Islands (+500)","isoCountry":""}
            ,{"cdCountry":"298","nmCountry":"Faroe Islands (+298)","isoCountry":""}
            ,{"cdCountry":"679","nmCountry":"Fiji (+679)","isoCountry":""}
            ,{"cdCountry":"358","nmCountry":"Finland (+358)","isoCountry":""}
            ,{"cdCountry":"33","nmCountry":"France (+33)","isoCountry":""}
            ,{"cdCountry":"594","nmCountry":"French Guiana (+594)","isoCountry":""}
            ,{"cdCountry":"689","nmCountry":"French Polynesia (+689)","isoCountry":""}
            ,{"cdCountry":"241","nmCountry":"Gabon (+241)","isoCountry":""}
            ,{"cdCountry":"220","nmCountry":"Gambia (+220)","isoCountry":""}
            ,{"cdCountry":"7880","nmCountry":"Georgia (+7880)","isoCountry":""}
            ,{"cdCountry":"49","nmCountry":"Germany (+49)","isoCountry":""}
            ,{"cdCountry":"233","nmCountry":"Ghana (+233)","isoCountry":""}
            ,{"cdCountry":"350","nmCountry":"Gibraltar (+350)","isoCountry":""}
            ,{"cdCountry":"30","nmCountry":"Greece (+30)","isoCountry":""}
            ,{"cdCountry":"299","nmCountry":"Greenland (+299)","isoCountry":""}
            ,{"cdCountry":"1473","nmCountry":"Grenada (+1473)","isoCountry":""}
            ,{"cdCountry":"590","nmCountry":"Guadeloupe (+590)","isoCountry":""}
            ,{"cdCountry":"671","nmCountry":"Guam (+671)","isoCountry":""}
            ,{"cdCountry":"502","nmCountry":"Guatemala (+502)","isoCountry":""}
            ,{"cdCountry":"224","nmCountry":"Guinea (+224)","isoCountry":""}
            ,{"cdCountry":"245","nmCountry":"Guinea - Bissau (+245)","isoCountry":""}
            ,{"cdCountry":"592","nmCountry":"Guyana (+592)","isoCountry":""}
            ,{"cdCountry":"509","nmCountry":"Haiti (+509)","isoCountry":""}
            ,{"cdCountry":"504","nmCountry":"Honduras (+504)","isoCountry":""}
            ,{"cdCountry":"852","nmCountry":"Hong Kong (+852)","isoCountry":""}
            ,{"cdCountry":"36","nmCountry":"Hungary (+36)","isoCountry":""}
            ,{"cdCountry":"354","nmCountry":"Iceland (+354)","isoCountry":""}
            ,{"cdCountry":"91","nmCountry":"India (+91)","isoCountry":""}
            ,{"cdCountry":"62","nmCountry":"Indonesia (+62)","isoCountry":""}
            ,{"cdCountry":"964","nmCountry":"Iraq (+964)","isoCountry":""}
            ,{"cdCountry":"98","nmCountry":"Iran (+98)","isoCountry":""}
            ,{"cdCountry":"353","nmCountry":"Ireland (+353)","isoCountry":""}
            ,{"cdCountry":"972","nmCountry":"Israel (+972)","isoCountry":""}
            ,{"cdCountry":"39","nmCountry":"Italy (+39)","isoCountry":""}
            ,{"cdCountry":"1876","nmCountry":"Jamaica (+1876)","isoCountry":""}
            ,{"cdCountry":"81","nmCountry":"Japan (+81)","isoCountry":""}
            ,{"cdCountry":"962","nmCountry":"Jordan (+962)","isoCountry":""}
            ,{"cdCountry":"7","nmCountry":"Kazakhstan (+7)","isoCountry":""}
            ,{"cdCountry":"254","nmCountry":"Kenya (+254)","isoCountry":""}
            ,{"cdCountry":"686","nmCountry":"Kiribati (+686)","isoCountry":""}
            ,{"cdCountry":"850","nmCountry":"Korea - North (+850)","isoCountry":""}
            ,{"cdCountry":"82","nmCountry":"Korea - South (+82)","isoCountry":""}
            ,{"cdCountry":"965","nmCountry":"Kuwait (+965)","isoCountry":""}
            ,{"cdCountry":"996","nmCountry":"Kyrgyzstan (+996)","isoCountry":""}
            ,{"cdCountry":"856","nmCountry":"Laos (+856)","isoCountry":""}
            ,{"cdCountry":"371","nmCountry":"Latvia (+371)","isoCountry":""}
            ,{"cdCountry":"961","nmCountry":"Lebanon (+961)","isoCountry":""}
            ,{"cdCountry":"266","nmCountry":"Lesotho (+266)","isoCountry":""}
            ,{"cdCountry":"231","nmCountry":"Liberia (+231)","isoCountry":""}
            ,{"cdCountry":"218","nmCountry":"Libya (+218)","isoCountry":""}
            ,{"cdCountry":"417","nmCountry":"Liechtenstein (+417)","isoCountry":""}
            ,{"cdCountry":"370","nmCountry":"Lithuania (+370)","isoCountry":""}
            ,{"cdCountry":"352","nmCountry":"Luxembourg (+352)","isoCountry":""}
            ,{"cdCountry":"853","nmCountry":"Macao (+853)","isoCountry":""}
            ,{"cdCountry":"389","nmCountry":"Macedonia (+389)","isoCountry":""}
            ,{"cdCountry":"261","nmCountry":"Madagascar (+261)","isoCountry":""}
            ,{"cdCountry":"265","nmCountry":"Malawi (+265)","isoCountry":""}
            ,{"cdCountry":"60","nmCountry":"Malaysia (+60)","isoCountry":""}
            ,{"cdCountry":"960","nmCountry":"Maldives (+960)","isoCountry":""}
            ,{"cdCountry":"223","nmCountry":"Mali (+223)","isoCountry":""}
            ,{"cdCountry":"356","nmCountry":"Malta (+356)","isoCountry":""}
            ,{"cdCountry":"692","nmCountry":"Marshall Islands (+692)","isoCountry":""}
            ,{"cdCountry":"596","nmCountry":"Martinique (+596)","isoCountry":""}
            ,{"cdCountry":"222","nmCountry":"Mauritania (+222)","isoCountry":""}
            ,{"cdCountry":"269","nmCountry":"Mayotte (+269)","isoCountry":""}
            ,{"cdCountry":"52","nmCountry":"Mexico (+52)","isoCountry":""}
            ,{"cdCountry":"691","nmCountry":"Micronesia (+691)","isoCountry":""}
            ,{"cdCountry":"373","nmCountry":"Moldova (+373)","isoCountry":""}
            ,{"cdCountry":"377","nmCountry":"Monaco (+377)","isoCountry":""}
            ,{"cdCountry":"976","nmCountry":"Mongolia (+976)","isoCountry":""}
            ,{"cdCountry":"1664","nmCountry":"Montserrat (+1664)","isoCountry":""}
            ,{"cdCountry":"212","nmCountry":"Morocco (+212)","isoCountry":""}
            ,{"cdCountry":"258","nmCountry":"Mozambique (+258)","isoCountry":""}
            ,{"cdCountry":"95","nmCountry":"Myanmar (+95)","isoCountry":""}
            ,{"cdCountry":"264","nmCountry":"Namibia (+264)","isoCountry":""}
            ,{"cdCountry":"674","nmCountry":"Nauru (+674)","isoCountry":""}
            ,{"cdCountry":"977","nmCountry":"Nepal (+977)","isoCountry":""}
            ,{"cdCountry":"31","nmCountry":"Netherlands (+31)","isoCountry":""}
            ,{"cdCountry":"687","nmCountry":"New Caledonia (+687)","isoCountry":""}
            ,{"cdCountry":"505","nmCountry":"Nicaragua (+505)","isoCountry":""}
            ,{"cdCountry":"227","nmCountry":"Niger (+227)","isoCountry":""}
            ,{"cdCountry":"234","nmCountry":"Nigeria (+234)","isoCountry":""}
            ,{"cdCountry":"683","nmCountry":"Niue (+683)","isoCountry":""}
            ,{"cdCountry":"672","nmCountry":"Norfolk Islands (+672)","isoCountry":""}
            ,{"cdCountry":"670","nmCountry":"Northern Marianas (+670)","isoCountry":""}
            ,{"cdCountry":"47","nmCountry":"Norway (+47)","isoCountry":""}
            ,{"cdCountry":"968","nmCountry":"Oman (+968)","isoCountry":""}
            ,{"cdCountry":"92","nmCountry":"Pakistan (+92)","isoCountry":""}
            ,{"cdCountry":"680","nmCountry":"Palau (+680)","isoCountry":""}
            ,{"cdCountry":"507","nmCountry":"Panama (+507)","isoCountry":""}
            ,{"cdCountry":"675","nmCountry":"Papua New Guinea (+675)","isoCountry":""}
            ,{"cdCountry":"595","nmCountry":"Paraguay (+595)","isoCountry":""}
            ,{"cdCountry":"51","nmCountry":"Peru (+51)","isoCountry":""}
            ,{"cdCountry":"63","nmCountry":"Philippines (+63)","isoCountry":""}
            ,{"cdCountry":"48","nmCountry":"Poland (+48)","isoCountry":""}
            ,{"cdCountry":"351","nmCountry":"Portugal (+351)","isoCountry":""}
            ,{"cdCountry":"1787","nmCountry":"Puerto Rico (+1787)","isoCountry":""}
            ,{"cdCountry":"974","nmCountry":"Qatar (+974)","isoCountry":""}
            ,{"cdCountry":"262","nmCountry":"Reunion (+262)","isoCountry":""}
            ,{"cdCountry":"40","nmCountry":"Romania (+40)","isoCountry":""}
            ,{"cdCountry":"7","nmCountry":"Russia (+7)","isoCountry":""}
            ,{"cdCountry":"250","nmCountry":"Rwanda (+250)","isoCountry":""}
            ,{"cdCountry":"378","nmCountry":"San Marino (+378)","isoCountry":""}
            ,{"cdCountry":"239","nmCountry":"Sao Tome &amp; Principe (+239)","isoCountry":""}
            ,{"cdCountry":"966","nmCountry":"Saudi Arabia (+966)","isoCountry":""}
            ,{"cdCountry":"221","nmCountry":"Senegal (+221)","isoCountry":""}
            ,{"cdCountry":"381","nmCountry":"Serbia (+381)","isoCountry":""}
            ,{"cdCountry":"248","nmCountry":"Seychelles (+248)","isoCountry":""}
            ,{"cdCountry":"232","nmCountry":"Sierra Leone (+232)","isoCountry":""}
            ,{"cdCountry":"65","nmCountry":"Singapore (+65)","isoCountry":""}
            ,{"cdCountry":"421","nmCountry":"Slovak Republic (+421)","isoCountry":""}
            ,{"cdCountry":"386","nmCountry":"Slovenia (+386)","isoCountry":""}
            ,{"cdCountry":"677","nmCountry":"Solomon Islands (+677)","isoCountry":""}
            ,{"cdCountry":"252","nmCountry":"Somalia (+252)","isoCountry":""}
            ,{"cdCountry":"27","nmCountry":"South Africa (+27)","isoCountry":""}
            ,{"cdCountry":"34","nmCountry":"Spain (+34)","isoCountry":""}
            ,{"cdCountry":"94","nmCountry":"Sri Lanka (+94)","isoCountry":""}
            ,{"cdCountry":"290","nmCountry":"St. Helena (+290)","isoCountry":""}
            ,{"cdCountry":"1869","nmCountry":"St. Kitts (+1869)","isoCountry":""}
            ,{"cdCountry":"1758","nmCountry":"St. Lucia (+1758)","isoCountry":""}
            ,{"cdCountry":"597","nmCountry":"Suriname (+597)","isoCountry":""}
            ,{"cdCountry":"249","nmCountry":"Sudan (+249)","isoCountry":""}
            ,{"cdCountry":"268","nmCountry":"Swaziland (+268)","isoCountry":""}
            ,{"cdCountry":"46","nmCountry":"Sweden (+46)","isoCountry":""}
            ,{"cdCountry":"41","nmCountry":"Switzerland (+41)","isoCountry":""}
            ,{"cdCountry":"963","nmCountry":"Syria (+963)","isoCountry":""}
            ,{"cdCountry":"886","nmCountry":"Taiwan (+886)","isoCountry":""}
            ,{"cdCountry":"992","nmCountry":"Tajikistan (+992)","isoCountry":""}
            ,{"cdCountry":"66","nmCountry":"Thailand (+66)","isoCountry":""}
            ,{"cdCountry":"228","nmCountry":"Togo (+228)","isoCountry":""}
            ,{"cdCountry":"676","nmCountry":"Tonga (+676)","isoCountry":""}
            ,{"cdCountry":"1868","nmCountry":"Trinidad &amp; Tobago (+1868)","isoCountry":""}
            ,{"cdCountry":"216","nmCountry":"Tunisia (+216)","isoCountry":""}
            ,{"cdCountry":"90","nmCountry":"Turkey (+90)","isoCountry":""}
            ,{"cdCountry":"993","nmCountry":"Turkmenistan (+993)","isoCountry":""}
            ,{"cdCountry":"1649","nmCountry":"Turks &amp; Caicos Islands (+1649)","isoCountry":""}
            ,{"cdCountry":"688","nmCountry":"Tuvalu (+688)","isoCountry":""}
            ,{"cdCountry":"256","nmCountry":"Uganda (+256)","isoCountry":""}
            ,{"cdCountry":"380","nmCountry":"Ukraine (+380)","isoCountry":""}
            ,{"cdCountry":"971","nmCountry":"United Arab Emirates (+971)","isoCountry":""}
            ,{"cdCountry":"598","nmCountry":"Uruguay (+598)","isoCountry":""}
            ,{"cdCountry":"998","nmCountry":"Uzbekistan (+998)","isoCountry":""}
            ,{"cdCountry":"678","nmCountry":"Vanuatu (+678)","isoCountry":""}
            ,{"cdCountry":"379","nmCountry":"Vatican City (+379)","isoCountry":""}
            ,{"cdCountry":"58","nmCountry":"Venezuela (+58)","isoCountry":""}
            ,{"cdCountry":"84","nmCountry":"Vietnam (+84)","isoCountry":""}
            ,{"cdCountry":"1","nmCountry":"Virgin Islands - British (+1)","isoCountry":""}
            ,{"cdCountry":"1","nmCountry":"Virgin Islands - US (+1)","isoCountry":""}
            ,{"cdCountry":"681","nmCountry":"Wallis &amp; Futuna (+681)","isoCountry":""}
            ,{"cdCountry":"969","nmCountry":"Yemen (North)(+969)","isoCountry":""}
            ,{"cdCountry":"967","nmCountry":"Yemen (South)(+967)","isoCountry":""}
            ,{"cdCountry":"260","nmCountry":"Zambia (+260)","isoCountry":""}
            ,{"cdCountry":"263","nmCountry":"Zimbabwe (+263)","isoCountry":""}
            ];

    	const writable_props = ['ddi', 'phone'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Phone> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		ddi = select_value(this);
    		$$invalidate('ddi', ddi);
    		$$invalidate('ddiList', ddiList);
    	}

    	function input_input_handler() {
    		phone = this.value;
    		$$invalidate('phone', phone);
    	}

    	$$self.$set = $$props => {
    		if ('ddi' in $$props) $$invalidate('ddi', ddi = $$props.ddi);
    		if ('phone' in $$props) $$invalidate('phone', phone = $$props.phone);
    	};

    	$$self.$capture_state = () => {
    		return { ddi, phone, ddiList };
    	};

    	$$self.$inject_state = $$props => {
    		if ('ddi' in $$props) $$invalidate('ddi', ddi = $$props.ddi);
    		if ('phone' in $$props) $$invalidate('phone', phone = $$props.phone);
    		if ('ddiList' in $$props) $$invalidate('ddiList', ddiList = $$props.ddiList);
    	};

    	return {
    		ddi,
    		phone,
    		ddiList,
    		select_change_handler,
    		input_input_handler
    	};
    }

    class Phone extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["ddi", "phone"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Phone", options, id: create_fragment$2.name });
    	}

    	get ddi() {
    		throw new Error("<Phone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ddi(value) {
    		throw new Error("<Phone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get phone() {
    		throw new Error("<Phone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set phone(value) {
    		throw new Error("<Phone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Head.svelte generated by Svelte v3.12.1 */

    const file$3 = "src\\Head.svelte";

    function create_fragment$3(ctx) {
    	var nav, div, span, t;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			span = element("span");
    			t = text(ctx.titulo);
    			attr_dev(span, "class", "font-semibold text-xl tracking-tight");
    			add_location(span, file$3, 7, 4, 273);
    			attr_dev(div, "class", "flex w-500 items-center flex-shrink-0 text-white mr-6");
    			add_location(div, file$3, 6, 2, 196);
    			attr_dev(nav, "class", "flex items-center justify-between bg-teal-500 p-6 svelte-sdvzku");
    			add_location(nav, file$3, 5, 0, 129);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			append_dev(div, span);
    			append_dev(span, t);
    		},

    		p: function update(changed, ctx) {
    			if (changed.titulo) {
    				set_data_dev(t, ctx.titulo);
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(nav);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { titulo } = $$props;

    	const writable_props = ['titulo'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Head> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('titulo' in $$props) $$invalidate('titulo', titulo = $$props.titulo);
    	};

    	$$self.$capture_state = () => {
    		return { titulo };
    	};

    	$$self.$inject_state = $$props => {
    		if ('titulo' in $$props) $$invalidate('titulo', titulo = $$props.titulo);
    	};

    	return { titulo };
    }

    class Head extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["titulo"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Head", options, id: create_fragment$3.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.titulo === undefined && !('titulo' in props)) {
    			console.warn("<Head> was created without expected prop 'titulo'");
    		}
    	}

    	get titulo() {
    		throw new Error("<Head>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titulo(value) {
    		throw new Error("<Head>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.12.1 */

    const file$4 = "src\\App.svelte";

    function create_fragment$4(ctx) {
    	var title_value, t0, main, t1, div0, p0, t3, p1, t5, p2, t7, div1, updating_ddi, updating_phone, t8, t9, current;

    	document.title = title_value = tit;

    	var head = new Head({
    		props: { titulo: tit },
    		$$inline: true
    	});

    	function phone_1_ddi_binding(value) {
    		ctx.phone_1_ddi_binding.call(null, value);
    		updating_ddi = true;
    		add_flush_callback(() => updating_ddi = false);
    	}

    	function phone_1_phone_binding(value_1) {
    		ctx.phone_1_phone_binding.call(null, value_1);
    		updating_phone = true;
    		add_flush_callback(() => updating_phone = false);
    	}

    	let phone_1_props = {};
    	if (ctx.ddi !== void 0) {
    		phone_1_props.ddi = ctx.ddi;
    	}
    	if (ctx.phone !== void 0) {
    		phone_1_props.phone = ctx.phone;
    	}
    	var phone_1 = new Phone({ props: phone_1_props, $$inline: true });

    	binding_callbacks.push(() => bind(phone_1, 'ddi', phone_1_ddi_binding));
    	binding_callbacks.push(() => bind(phone_1, 'phone', phone_1_phone_binding));

    	var button = new Button({
    		props: { open: ctx.abreZap },
    		$$inline: true
    	});

    	var githubbutton = new GithubButton({
    		props: {
    		caption: "paiva-thiago",
    		url: "https://github.com/paiva-thiago/open-whats"
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			t0 = space();
    			main = element("main");
    			head.$$.fragment.c();
    			t1 = space();
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "VOCÊ";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Já precisou mandar aquele zap pra aquele contato que você não quer adicionar??";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "SEUS PROBLEMAS ACABARAM! - Chegou o OpenWhats! Selecione o código do país e preencha com o DDD + número, que o OpenWhats abre pra você!";
    			t7 = space();
    			div1 = element("div");
    			phone_1.$$.fragment.c();
    			t8 = space();
    			button.$$.fragment.c();
    			t9 = space();
    			githubbutton.$$.fragment.c();
    			attr_dev(p0, "class", "font-bold");
    			add_location(p0, file$4, 23, 3, 641);
    			attr_dev(p1, "class", "text-sm");
    			add_location(p1, file$4, 24, 3, 675);
    			attr_dev(p2, "class", "text-sm");
    			add_location(p2, file$4, 25, 3, 781);
    			attr_dev(div0, "class", "bg-teal-100 border-t border-b border-teal-500 text-teal-700 px-4 py-3 top-100 pb-100");
    			attr_dev(div0, "role", "alert");
    			add_location(div0, file$4, 22, 2, 525);
    			attr_dev(div1, "class", "bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4");
    			add_location(div1, file$4, 27, 1, 953);
    			add_location(main, file$4, 20, 0, 491);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(head, main, null);
    			append_dev(main, t1);
    			append_dev(main, div0);
    			append_dev(div0, p0);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			append_dev(div0, t5);
    			append_dev(div0, p2);
    			append_dev(main, t7);
    			append_dev(main, div1);
    			mount_component(phone_1, div1, null);
    			append_dev(div1, t8);
    			mount_component(button, div1, null);
    			append_dev(main, t9);
    			mount_component(githubbutton, main, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if ((!current || changed.tit) && title_value !== (title_value = tit)) {
    				document.title = title_value;
    			}

    			var phone_1_changes = {};
    			if (!updating_ddi && changed.ddi) {
    				phone_1_changes.ddi = ctx.ddi;
    			}
    			if (!updating_phone && changed.phone) {
    				phone_1_changes.phone = ctx.phone;
    			}
    			phone_1.$set(phone_1_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(head.$$.fragment, local);

    			transition_in(phone_1.$$.fragment, local);

    			transition_in(button.$$.fragment, local);

    			transition_in(githubbutton.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(head.$$.fragment, local);
    			transition_out(phone_1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(githubbutton.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(main);
    			}

    			destroy_component(head);

    			destroy_component(phone_1);

    			destroy_component(button);

    			destroy_component(githubbutton);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    let tit   = 'OpenWhats';

    function instance$4($$self, $$props, $$invalidate) {
    	
      let ddi   = '';
      let phone = '';
      const abreZap = ()=>{
        if((ddi.trim()!='')&&(phone.trim()!='')){
          window.open(`https://api.whatsapp.com/send?phone=${ddi}${phone}`);       
        } 
      };

    	function phone_1_ddi_binding(value) {
    		ddi = value;
    		$$invalidate('ddi', ddi);
    	}

    	function phone_1_phone_binding(value_1) {
    		phone = value_1;
    		$$invalidate('phone', phone);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('tit' in $$props) $$invalidate('tit', tit = $$props.tit);
    		if ('ddi' in $$props) $$invalidate('ddi', ddi = $$props.ddi);
    		if ('phone' in $$props) $$invalidate('phone', phone = $$props.phone);
    	};

    	return {
    		ddi,
    		phone,
    		abreZap,
    		phone_1_ddi_binding,
    		phone_1_phone_binding
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$4.name });
    	}
    }

    const app = new App({
        target: document.body
    });

}());
//# sourceMappingURL=main.js.map
