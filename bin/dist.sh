#!/usr/bin/env bash

cd $(dirname $(readlink -f $0))
cd ..

zip -r New-New-Tab-Page.zip . -x *.git* -x bin/\* -x .eslint* -x js-unminified/\*